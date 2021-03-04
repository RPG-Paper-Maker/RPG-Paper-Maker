/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include <QFileDialog>
#include <QProcess>
#include <QJsonDocument>
#include <QDebug>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QEventLoop>
#include <QUrl>
#include <QDesktopServices>
#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "dialognewproject.h"
#include "dialogdatas.h"
#include "dialogsystems.h"
#include "dialogvariables.h"
#include "dialogpictures.h"
#include "dialogkeyboardcontrols.h"
#include "dialogcollisions.h"
#include "dialogexport.h"
#include "panelmainmenu.h"
#include "panelproject.h"
#include "rpm.h"
#include "widgettreelocalmaps.h"
#include "dialoglocation.h"
#include "dialogprogress.h"
#include "dialogspecialelements.h"
#include "dialogdebugoptions.h"
#include "dialoggeneraloptions.h"
#include "dialogsongs.h"
#include "dialogshapes.h"
#include "dialogvideos.h"
#include "dialogfonts.h"
#include "common.h"
#include "dialogselectlanguage.h"

int MainWindow::MAX_BACKUPS = 5;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    m_isMainMenu(true),
    m_dialogScripts(new DialogScripts),
    m_firstCrash(true),
    m_timerBackup(new QTimer)
{
    p_appName = "RPG Paper Maker";
    gameProcess = new QProcess(this);
    project = nullptr;
    ui->setupUi(this);

    // Backup every 30 minutes
    connect(m_timerBackup, SIGNAL(timeout()), this, SLOT(updateBackup()));

    // Setting window title
    this->setWindowTitle(p_appName + " v." + Project::ENGINE_VERSION);

    // Auto updater
    ui->actionAuto_update->setChecked(RPM::get()->engineSettings()->updater());

    // Update main panel
    mainPanel = new PanelMainMenu(this);
    ui->centralWidget->layout()->addWidget(mainPanel);
    connect(mainPanel, SIGNAL(openingProject(QString)), this, SLOT(
        openRecentProject(QString)));

    // Connect process game
    connect(gameProcess, SIGNAL(errorOccurred(QProcess::ProcessError)), this,
        SLOT(on_gameErrorOccurred(QProcess::ProcessError)));

    // Add actions for recent projects
    updateMenuRecentProjects();

    // Menu bar enabled actions
    enableNoGame();

    this->translate();
}

MainWindow::~MainWindow()
{
    gameProcess->close();
    delete gameProcess;
    gameProcess = nullptr;
    cleanRecentProjectsActions();
    delete m_dialogScripts;
    delete ui;
    RPM::kill();
}

QString MainWindow::appName() const{ return p_appName; }

QString MainWindow::version() const{ return p_version; }

WidgetMapEditor* MainWindow::mapEditor() const{
    return ((PanelProject*)mainPanel)->widgetMapEditor();
}

PanelTextures * MainWindow::panelTextures() const {
    return  reinterpret_cast<PanelProject *>(mainPanel)->panelTextures();
}

DialogScripts * MainWindow::dialogScripts() const
{
    return m_dialogScripts;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

// -------------------------------------------------------
// Basic window for not implemented functions

void MainWindow::showNotImplementedWindow(QWidget* parent){
    QMessageBox::information(parent, "Warning", "Not implemented yet.");
}

// -------------------------------------------------------
// Only for mainwindow in order to be sure that menubar can't be pushed while
// opening a new dialog

int MainWindow::openDialog(QDialog& dialog){
    this->setEnabled(false);
    int res = dialog.exec();
    this->setEnabled(true);

    return res;
}

// -------------------------------------------------------

void MainWindow::newProject(){
    DialogNewProject dialog;
    if (openDialog(dialog) == QDialog::Accepted){
        openProject(Common::pathCombine(dialog.getLocation(),
                                       dialog.getDirectoryName()));
    }
}

// -------------------------------------------------------

void MainWindow::openExistingProject(){
    QString file = QFileDialog::getOpenFileName(this, RPM::translate(
        Translations::OPEN_PROJECT), RPM::PATH_GAMES, "RPG Paper Maker (*.rpm)");
    if (file.count() > 0) openProject(Common::getDirectoryPath(file));
}

// -------------------------------------------------------

void MainWindow::openProject(QString pathProject) {
    if ((project != nullptr && closeProject()) || project == nullptr){
        project = new Project;
        RPM::get()->setProject(project);

        if (project->read(pathProject)) {
            updateRecentProjects(project->gameDatas()->systemDatas()
                ->projectName()->mainName(), pathProject);
            enableGame();
            replaceMainPanel(new PanelProject(this, project));
            m_isMainMenu = false;
            m_dialogScripts->initialize();

            // Backup every 30 minutes
            m_timerBackup->start(1000 * 60 * 30);
            this->updateBackup();
        }
        else {
            delete project;
            project = nullptr;
            RPM::get()->setProject(nullptr);
        }
    }
}

// -------------------------------------------------------

bool MainWindow::closeProject(){
    if (!close())
        return false;

    RPM::mapsToSave.clear();
    RPM::mapsUndoRedo.clear();
    enableNoGame();
    delete project;
    project = nullptr;
    RPM::get()->setProject(nullptr);
    WidgetMapEditor* mapEditor = ((PanelProject*)mainPanel)->widgetMapEditor();
    mapEditor->setVisible(false);
    PanelMainMenu * panel = new PanelMainMenu(this);
    connect(panel, SIGNAL(openingProject(QString)), this, SLOT(
        openRecentProject(QString)));
    replaceMainPanel(panel);
    m_isMainMenu = true;

    return true;
}

// -------------------------------------------------------

void MainWindow::replaceMainPanel(QWidget* replacement){
    QLayout* layout = ui->centralWidget->layout();
    layout->removeWidget(mainPanel);
    delete mainPanel;
    mainPanel = replacement;
    layout->addWidget(mainPanel);
    mainPanel->setFocus();
    mainPanel->update();
    updateMenuRecentProjects();
}

// -------------------------------------------------------

void MainWindow::enableAll(bool b){
    ui->actionNew_project->setEnabled(b);
    ui->actionBrowse->setEnabled(b);
    ui->actionSave->setEnabled(b);
    ui->actionSave_all->setEnabled(b);
    ui->actionOpen_project_folder->setEnabled(b);
    ui->actionExport_standalone->setEnabled(b);
    ui->actionClose_project->setEnabled(b);
    ui->actionUndo->setEnabled(b);
    ui->actionRedo->setEnabled(b);
    ui->actionHeight_up->setEnabled(b);
    ui->actionHeight_down->setEnabled(b);
    ui->actionHeight_plus_up->setEnabled(b);
    ui->actionHeight_plus_down->setEnabled(b);
    ui->actionDatas_manager->setEnabled(b);
    ui->actionSystems_manager->setEnabled(b);
    ui->actionVariables_manager->setEnabled(b);
    ui->actionSongs_manager->setEnabled(b);
    ui->actionShapes_manager->setEnabled(b);
    ui->actionFonts_manager->setEnabled(b);
    ui->actionPictures_manager->setEnabled(b);
    ui->actionVideos_manager->setEnabled(b);
    ui->actionSet_BR_path_folder->setEnabled(b);
    ui->actionSet_DLC_s_path_folder->setEnabled(b);
    ui->actionDebug_options->setEnabled(b);
    ui->actionKeyboard_controls->setEnabled(b);
    ui->actionCollisions_manager->setEnabled(b);
    ui->actionScripts_manager->setEnabled(b);
    ui->actionAutotiles->setEnabled(b);
    ui->actionSprite_walls->setEnabled(b);
    ui->action3D_objects->setEnabled(b);
    ui->actionMountains->setEnabled(b);
    ui->actionShow_Hide_grid->setEnabled(b);
    ui->actionShow_Hide_square_informations->setEnabled(b);
    ui->actionPlay->setEnabled(b);
}

// -------------------------------------------------------

void MainWindow::enableNoGame(){ // When no project opened
    enableAll(false);
    ui->actionNew_project->setEnabled(true);
    ui->actionBrowse->setEnabled(true);
}

// -------------------------------------------------------

void MainWindow::enableGame(){ // When a project is opened
    enableNoGame();
    ui->actionSave->setEnabled(true);
    ui->actionSave_all->setEnabled(true);
    ui->actionOpen_project_folder->setEnabled(true);
    ui->actionExport_standalone->setEnabled(true);
    ui->actionClose_project->setEnabled(true);
    ui->actionUndo->setEnabled(true);
    ui->actionRedo->setEnabled(true);
    ui->actionHeight_up->setEnabled(true);
    ui->actionHeight_down->setEnabled(true);
    ui->actionHeight_plus_up->setEnabled(true);
    ui->actionHeight_plus_down->setEnabled(true);
    ui->actionDatas_manager->setEnabled(true);
    ui->actionSystems_manager->setEnabled(true);
    ui->actionVariables_manager->setEnabled(true);
    ui->actionSongs_manager->setEnabled(true);
    ui->actionPictures_manager->setEnabled(true);
    ui->actionVideos_manager->setEnabled(true);
    ui->actionShapes_manager->setEnabled(true);
    ui->actionFonts_manager->setEnabled(true);
    ui->actionSet_BR_path_folder->setEnabled(true);
    ui->actionSet_DLC_s_path_folder->setEnabled(true);
    ui->actionDebug_options->setEnabled(true);
    ui->actionKeyboard_controls->setEnabled(true);
    ui->actionScripts_manager->setEnabled(true);
    ui->actionCollisions_manager->setEnabled(true);
    ui->actionAutotiles->setEnabled(true);
    ui->actionSprite_walls->setEnabled(true);
    ui->action3D_objects->setEnabled(true);
    ui->actionMountains->setEnabled(true);
    ui->actionShow_Hide_grid->setEnabled(true);
    ui->actionShow_Hide_square_informations->setEnabled(true);
    ui->actionPlay->setEnabled(true);
}

// -------------------------------------------------------

void MainWindow::saveAllMaps(){

    // Save all the maps
    QSet<int>::iterator i;
    for (i = RPM::mapsToSave.begin(); i != RPM::mapsToSave.end(); i++){
        Map map(*i);
        map.save();
    }
    if (project->currentMap() != nullptr)
        project->currentMap()->setSaved(true);
    RPM::mapsToSave.clear();

    // Remove *
    ((PanelProject*)mainPanel)->widgetTreeLocalMaps()->updateAllNodesSaved();
}

// -------------------------------------------------------

void MainWindow::deleteTempMaps(){
    ((PanelProject*)mainPanel)->widgetTreeLocalMaps()->deleteAllMapTemp();
}

// -------------------------------------------------------

void MainWindow::updateTextures(){
    WidgetTreeLocalMaps* treeMap = ((PanelProject*) mainPanel)
            ->widgetTreeLocalMaps();

    treeMap->reload();
}

// -------------------------------------------------------

bool MainWindow::close() {
    if (project != nullptr) {
        if (RPM::mapsToSave.count() > 0){
            QMessageBox::StandardButton box = QMessageBox::question(this, RPM
                ::translate(Translations::QUIT), RPM::translate(Translations
                ::YOU_HAVE_MAPS_NOT_SAVED), QMessageBox::Yes |
                QMessageBox::No | QMessageBox::Cancel);
            if (box == QMessageBox::Yes)
                saveAllMaps();
            else if (box == QMessageBox::No)
                deleteTempMaps();
            else {
                return false;
            }
        }
        else
            deleteTempMaps();
    }

    // Remove Example project
    QDir(Common::pathCombine(QDir::currentPath(), RPM::PATH_EXAMPLE_GAME))
        .removeRecursively();

    return true;
}

// -------------------------------------------------------

void MainWindow::updateRecentProjects(QString projectName, QString path) {
    RPM::get()->engineSettings()->updateProject(projectName, path);
}

// -------------------------------------------------------

void MainWindow::updateMenuRecentProjects() {
    QAction *action;
    QString path;
    int i, l;

    // Clean menus
    cleanRecentProjectsActions();

    // Add menus
    for (i = 0, l = RPM::get()->engineSettings()->projectNumber(); i < l; i++) {
        action = new QAction(RPM::get()->engineSettings()->projectAtName(i));
        path = RPM::get()->engineSettings()->projectAtLink(i);
        connect(action, &QAction::triggered, [this, path]() {
            this->openProject(path);
        });
        ui->menuOpen_project->addAction(action);
    }
}

// -------------------------------------------------------

void MainWindow::cleanRecentProjectsActions() {
    QAction *action;
    int i;

    for (i = ui->menuOpen_project->actions().length() - 1; i >= 1; i--) {
        action = ui->menuOpen_project->actions().at(i);
        ui->menuOpen_project->removeAction(action);
        delete action;
    }
}

// -------------------------------------------------------

void MainWindow::runGame() {
    if (RPM::get()->project()->isHeroDefined()) {
        if (RPM::mapsToSave.count() > 0) {
            QMessageBox::StandardButton box = QMessageBox::question(this, RPM
                ::translate(Translations::SAVE), RPM::translate(Translations
                ::YOU_HAVE_MAPS_NOT_SAVED), QMessageBox::Yes |
                QMessageBox::No | QMessageBox::Cancel);
            if (box == QMessageBox::Yes) {
                saveAllMaps();
            } else if (box == QMessageBox::Cancel) {
                return;
            }
        }

        // Play process
        QString execName = "Game";
        #ifdef Q_OS_WIN
            execName += ".exe";
        #elif __linux__
            execName += "";
        #else
            execName += ".app";
        #endif

        if (gameProcess->isOpen()) {
            gameProcess->close();
        }
        gameProcess->start("\"" + Common::pathCombine(project
            ->pathCurrentProject(), execName) + "\"");
    } else {
        QMessageBox::critical(this, RPM::translate(Translations::NO_HERO_DEFINED
            ), RPM::translate(Translations::NO_HERO_DEFINED_DESCRIPTION) + RPM
            ::DOT);
    }
}

// -------------------------------------------------------

void MainWindow::translate() {
    ui->menuFile->setTitle(RPM::translate(Translations::FILE));
    ui->menuEdition->setTitle(RPM::translate(Translations::EDITION));
    ui->menuManagement->setTitle(RPM::translate(Translations::MANAGEMENT));
    ui->menuSpecials->setTitle(RPM::translate(Translations::SPECIAL_ELEMENTS));
    ui->menuDisplay->setTitle(RPM::translate(Translations::DISPLAY));
    ui->menuOptions->setTitle(RPM::translate(Translations::OPTIONS));
    ui->menuTest->setTitle(RPM::translate(Translations::TEST));
    ui->menuHelp->setTitle(RPM::translate(Translations::HELP));
    ui->actionNew_project->setText(RPM::translate(Translations::NEW_PROJECT) +
        RPM::DOT_DOT_DOT);
    ui->actionNew_project->setIconText(RPM::translate(Translations
        ::NEW_PROJECT_TOOL));
    ui->menuOpen_project->setTitle(RPM::translate(Translations::OPEN_PROJECT));
    ui->actionBrowse->setText(RPM::translate(Translations::BROWSE) + RPM
        ::DOT_DOT_DOT);
    ui->actionBrowse->setIconText(RPM::translate(Translations::OPEN_PROJECT_TOOL));
    ui->actionSave->setText(RPM::translate(Translations::SAVE));
    ui->actionSave->setIconText(RPM::translate(Translations::SAVE_TOOL));
    ui->actionSave_all->setText(RPM::translate(Translations::SAVE_ALL));
    ui->actionSave_all->setIconText(RPM::translate(Translations::SAVE_ALL_TOOL));
    ui->actionOpen_project_folder->setText(RPM::translate(Translations
        ::OPEN_PROJECT_FOLDER));
    ui->actionOpen_project_folder->setIconText(RPM::translate(Translations
        ::FOLDER));
    ui->actionExport_standalone->setText(RPM::translate(Translations
        ::EXPORT_STANDALONE) + RPM::DOT_DOT_DOT);
    ui->actionClose_project->setText(RPM::translate(Translations::CLOSE_PROJECT));
    ui->actionQuit->setText(RPM::translate(Translations::QUIT));
    ui->actionUndo->setText(RPM::translate(Translations::UNDO));
    ui->actionRedo->setText(RPM::translate(Translations::REDO));
    ui->actionHeight_up->setText(RPM::translate(Translations::HEIGHT_UP));
    ui->actionHeight_plus_up->setText(RPM::translate(Translations
        ::HEIGHT_PLUS_UP));
    ui->actionHeight_down->setText(RPM::translate(Translations::HEIGHT_DOWN));
    ui->actionHeight_plus_down->setText(RPM::translate(Translations
        ::HEIGHT_PLUS_DOWN));
    ui->actionDatas_manager->setText(RPM::translate(Translations
        ::DATAS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionDatas_manager->setIconText(RPM::translate(Translations
        ::DATAS_MANAGER_TOOL));
    ui->actionSystems_manager->setText(RPM::translate(Translations
        ::SYSTEMS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionSystems_manager->setIconText(RPM::translate(Translations
        ::SYSTEMS_MANAGER_TOOL));
    ui->actionVariables_manager->setText(RPM::translate(Translations
        ::VARIABLES_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionVariables_manager->setIconText(RPM::translate(Translations
        ::VARIABLES_MANAGER_TOOL));
    ui->actionCollisions_manager->setText(RPM::translate(Translations
        ::COLLISIONS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionCollisions_manager->setIconText(RPM::translate(Translations
        ::COLLISIONS_MANAGER_TOOL));
    ui->actionKeyboard_controls->setText(RPM::translate(Translations
        ::KEYBOARD_CONTROLS) + RPM::DOT_DOT_DOT);
    ui->actionKeyboard_controls->setIconText(RPM::translate(Translations
        ::KEYBOARD_CONTROLS_TOOL));
    ui->actionScripts_manager->setText(RPM::translate(Translations
        ::SCRIPTS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionScripts_manager->setIconText(RPM::translate(Translations
        ::SCRIPTS_MANAGER_TOOL));
    ui->actionPictures_manager->setText(RPM::translate(Translations
        ::PICTURES_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionPictures_manager->setIconText(RPM::translate(Translations
        ::PICTURES_MANAGER_TOOL));
    ui->actionVideos_manager->setText(RPM::translate(Translations
        ::VIDEOS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionVideos_manager->setIconText(RPM::translate(Translations
        ::VIDEOS_MANAGER_TOOL));
    ui->actionSongs_manager->setText(RPM::translate(Translations
        ::SONGS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionSongs_manager->setIconText(RPM::translate(Translations
        ::SONGS_MANAGER_TOOL));
    ui->actionShapes_manager->setText(RPM::translate(Translations
        ::SHAPES_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionShapes_manager->setIconText(RPM::translate(Translations
        ::SHAPES_MANAGER_TOOL));
    ui->actionFonts_manager->setText(RPM::translate(Translations
        ::FONTS_MANAGER) + RPM::DOT_DOT_DOT);
    ui->actionFonts_manager->setIconText(RPM::translate(Translations
        ::FONTS_MANAGER_TOOL));
    ui->actionAutotiles->setText(RPM::translate(Translations::AUTOTILES) + RPM
        ::DOT_DOT_DOT);
    ui->actionAutotiles->setIconText(RPM::translate(Translations::AUTOTILES_TOOL));
    ui->actionAnimated_Autotiles->setText(RPM::translate(Translations
        ::ANIMATED_AUTOTILES) + RPM::DOT_DOT_DOT);
    ui->actionAnimated_Autotiles->setIconText(RPM::translate(Translations
        ::ANIMATED_AUTOTILES_TOOL));
    ui->actionSprite_walls->setText(RPM::translate(Translations::WALLS) + RPM
        ::DOT_DOT_DOT);
    ui->actionSprite_walls->setIconText(RPM::translate(Translations::WALLS_TOOL));
    ui->action3D_objects->setText(RPM::translate(Translations::THREED_OBJECTS) +
        RPM::DOT_DOT_DOT);
    ui->action3D_objects->setIconText(RPM::translate(Translations
        ::THREED_OBJECTS_TOOL));
    ui->actionMountains->setText(RPM::translate(Translations::MOUNTAINS) + RPM
        ::DOT_DOT_DOT);
    ui->actionMountains->setIconText(RPM::translate(Translations::MOUNTAINS_TOOL));
    ui->actionSet_BR_path_folder->setText(RPM::translate(Translations
        ::SET_BR_PATH_FOLDER) + RPM::DOT_DOT_DOT);
    ui->actionSet_DLC_s_path_folder->setText(RPM::translate(Translations
        ::SET_DLC_S_PATH_FOLDER) + RPM::DOT_DOT_DOT);
    ui->actionDebug_options->setText(RPM::translate(Translations
        ::DEBUG_OPTIONS) + RPM::DOT_DOT_DOT);
    ui->actionGeneral_options->setText(RPM::translate(Translations
        ::GENERAL_OPTIONS) + RPM::DOT_DOT_DOT);
    ui->actionChange_language->setText(RPM::translate(Translations
        ::CHANGE_LANGUAGE) + RPM::DOT_DOT_DOT);
    ui->actionShow_Hide_grid->setText(RPM::translate(Translations
        ::SHOW_HIDE_GRID));
    ui->actionShow_Hide_square_informations->setText(RPM::translate(Translations
        ::SHOW_HIDE_SQUARE_INFORMATION));
    ui->actionPlay->setText(RPM::translate(Translations::PLAY));
    ui->actionPlay->setIconText(RPM::translate(Translations::PLAY_TOOL));
    ui->actionAbout->setText(RPM::translate(Translations::ABOUT) + RPM
        ::DOT_DOT_DOT);
    ui->actionAuto_update->setText(RPM::translate(Translations
        ::AUTO_DISPLAY_UPDATER));
    if (m_isMainMenu)
    {
        reinterpret_cast<PanelMainMenu *>(mainPanel)->translate();
    } else
    {
        reinterpret_cast<PanelProject *>(mainPanel)->translate();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void MainWindow::on_actionNew_project_triggered(){
    newProject();
}

// -------------------------------------------------------

void MainWindow::on_actionBrowse_triggered(){
    openExistingProject();
}

// -------------------------------------------------------

void MainWindow::on_actionClean_recent_projects_triggered()
{
    RPM::get()->engineSettings()->clearProjects();
}

// -------------------------------------------------------

void MainWindow::on_actionSave_triggered(){
    if (project->currentMap() != nullptr) {
        project->saveCurrentMap();
        RPM::mapsToSave.remove(project->currentMap()->mapProperties()->id());
        ((PanelProject*)mainPanel)->widgetMapEditor()->save();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionSave_all_triggered(){
    saveAllMaps();
}

// -------------------------------------------------------

void MainWindow::on_actionOpen_project_folder_triggered()
{
    QDesktopServices::openUrl(QUrl::fromLocalFile(project->pathCurrentProject()));
}

// -------------------------------------------------------

void MainWindow::on_actionExport_standalone_triggered(){
    DialogExport dialog(project);
    openDialog(dialog);
}

// -------------------------------------------------------

void MainWindow::on_actionClose_project_triggered(){
    closeProject();
}

// -------------------------------------------------------

void MainWindow::on_actionQuit_triggered(){
    if (close())
        qApp->quit();
}

// -------------------------------------------------------

void MainWindow::on_actionUndo_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->undo();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionRedo_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->redo();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionHeight_up_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->heightUp();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionHeight_plus_up_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->heightPlusUp();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionHeight_down_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->heightDown();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionHeight_plus_down_triggered() {
    if (project->currentMap() != nullptr) {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->heightPlusDown();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionZoom_in_triggered()
{
    if (project->currentMap() != nullptr)
    {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->zoom(1);
    }
}

// -------------------------------------------------------

void MainWindow::on_actionZoom_out_triggered()
{
    if (project->currentMap() != nullptr)
    {
        reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()->zoom(-1);
    }
}

// -------------------------------------------------------

void MainWindow::on_actionDatas_manager_triggered(){
    RPM::isInConfig = true;
    DialogDatas dialog(project->gameDatas());
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writeGameDatas();
        project->writePicturesDatas();
    }
    else {
        project->readGameDatas();
        project->readPicturesDatas();
    }
    RPM::isInConfig = false;

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSystems_manager_triggered(){
    RPM::isInConfig = true;
    DialogSystems dialog(project->gameDatas());
    float ps = project->gameDatas()->systemDatas()->squareSize();
    if (openDialog(dialog) == QDialog::Accepted)
    {
        // If square size different, update all maps camera distance
        float s = dialog.getSquareSize();
        if (!qFuzzyCompare(s, ps))
        {
            reinterpret_cast<PanelProject *>(mainPanel)->widgetTreeLocalMaps()
                ->updateSquareSizeCoef(s, ps);
            reinterpret_cast<PanelProject *>(mainPanel)->widgetMapEditor()
                ->updateTagsSquares(s, ps);
        }
        project->writeGameDatas();
    }
    else
        project->readGameDatas();
    RPM::isInConfig = false;

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionVariables_manager_triggered(){
    DialogVariables dialog;
    dialog.initializeModel(project->gameDatas()->variablesDatas()->model());
    openDialog(dialog);
}

// -------------------------------------------------------

void MainWindow::on_actionSongs_manager_triggered() {
    DialogSongs dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSongsDatas();
    else
        project->readSongsDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionPictures_manager_triggered(){
    DialogPictures dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writePicturesDatas();
    else
        project->readPicturesDatas();

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionVideos_manager_triggered() {
    DialogVideos dialog;
    if (this->openDialog(dialog) == QDialog::Accepted) {
        project->writeVideosDatas();
    } else {
        project->readVideosDatas();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionShapes_manager_triggered() {
    DialogShapes dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeShapesDatas();
    else
        project->readShapesDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionFonts_manager_triggered()
{
    DialogFonts dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeFontsDatas();
    else
        project->readFontsDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionKeyboard_controls_triggered(){
    DialogKeyBoardControls dialog(project, RPM::get()->engineSettings());
    if (openDialog(dialog) == QDialog::Accepted) {
        RPM::get()->saveEngineSettings();
        project->writeKeyBoardDatas();
        project->readKeyBoardDatas();
    }
    else{
        RPM::get()->loadEngineSettings();
        project->readKeyBoardDatas();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionScripts_manager_triggered()
{
    if (m_dialogScripts->isHidden())
    {
        m_dialogScripts->initialize();
        m_dialogScripts->show();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionCollisions_manager_triggered() {
    DialogCollisions dialog;
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writePicturesDatas();
        project->writeSpecialsDatas();
        project->writeShapesDatas();
    } else {
        project->readPicturesDatas();
        project->readSpecialsDatas();
        project->readShapesDatas();
    }

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionAutotiles_triggered() {
    DialogSpecialElements dialog(PictureKind::Autotiles);
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writePicturesDatas();
        project->writeSpecialsDatas();
    } else {
        project->readPicturesDatas();
        project->readSpecialsDatas();
    }

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSprite_walls_triggered() {
    DialogSpecialElements dialog(PictureKind::Walls);
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writePicturesDatas();
        project->writeSpecialsDatas();
    } else {
        project->readPicturesDatas();
        project->readSpecialsDatas();
    }

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_action3D_objects_triggered() {
    DialogSpecialElements dialog(PictureKind::Object3D);
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writePicturesDatas();
        project->writeSpecialsDatas();
        project->writeShapesDatas();
    } else {
        project->readPicturesDatas();
        project->readSpecialsDatas();
        project->readShapesDatas();
    }

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionMountains_triggered() {
    DialogSpecialElements dialog(PictureKind::Mountains);
    if (openDialog(dialog) == QDialog::Accepted) {
        project->writePicturesDatas();
        project->writeSpecialsDatas();
    } else {
        project->readPicturesDatas();
        project->readSpecialsDatas();
    }

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSet_BR_path_folder_triggered(){
    DialogLocation dialog(project->gameDatas()->systemDatas()->pathBR(), Common
        ::pathCombine(QDir::currentPath(), RPM::PATH_BR));

    if (openDialog(dialog) == QDialog::Accepted)
    {
        project->gameDatas()->systemDatas()->setPathBR(dialog.location());
        project->writeSystemDatas();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionSet_DLC_s_path_folder_triggered()
{
    DialogLocation dialog(project->gameDatas()->dlcsDatas()->path(), Common
        ::pathCombine(QDir::currentPath(), RPM::PATH_DLCS));

    if (openDialog(dialog) == QDialog::Accepted)
    {
        project->gameDatas()->dlcsDatas()->setPath(dialog.location());
        project->writeDlcs();
    }
}

// -------------------------------------------------------

void MainWindow::on_actionDebug_options_triggered() {
    DialogDebugOptions dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSystemDatas();
    else
        project->readSystemDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionGeneral_options_triggered() {
    DialogGeneralOptions dialog;
    openDialog(dialog);
}

// -------------------------------------------------------

void MainWindow::on_actionChange_language_triggered()
{
    DialogSelectLanguage dialog;
    openDialog(dialog);
}

// -------------------------------------------------------

void MainWindow::on_actionShow_Hide_grid_triggered() {
    ((PanelProject*)mainPanel)->widgetMapEditor()->showHideGrid();
}

// -------------------------------------------------------

void MainWindow::on_actionShow_Hide_square_informations_triggered() {
    ((PanelProject*)mainPanel)->widgetMapEditor()->showHideSquareInformations();
}

// -------------------------------------------------------

void MainWindow::on_actionPlay_triggered() {
    m_firstCrash = true;
    this->runGame();
}

// -------------------------------------------------------

void MainWindow::on_actionAuto_update_toggled(bool checked) {
    RPM::get()->engineSettings()->setUpdater(checked);
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void MainWindow::on_actionAbout_triggered() {
    QNetworkAccessManager manager;
    QNetworkReply *reply;
    QEventLoop loop;
    QJsonObject doc;
    QJsonDocument json;
    QString name, website, buildDate, copyright, patreonThanks,
        patreonPreviousThanks;

    // Get patreon names
    reply = manager.get(QNetworkRequest(QUrl("https://raw.githubusercontent.com/"
        "RPG-Paper-Maker/RPG-Paper-Maker/develop"
        "/EditorApp/Content/patreon.json")));

    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() == QNetworkReply::NetworkError::NoError) {
        doc = QJsonDocument::fromJson(reply->readAll()).object();
        Common::writeOtherJSON(Common::pathCombine(QDir::currentPath(), RPM
            ::PATH_PATREON), doc);
    } else {
        Common::readOtherJSON(Common::pathCombine(QDir::currentPath(), RPM
            ::PATH_PATREON), json);
        doc = json.object();
    }
    patreonThanks = doc["current"].toString();
    patreonPreviousThanks = doc["previous"].toString();

    name = "RPG Paper Maker";
    website = "http://rpg-paper-maker.com/";
    buildDate = Project::LAST_BUILD_DATE;
    copyright =  "RPG Paper Maker Copyright (C) 2017-2021 Wano\n\n" + RPM
        ::translate(Translations::COPYRIGHT) + RPM::DOT;
    QMessageBox::about(this, RPM::translate(Translations::ABOUT), name + RPM
        ::SPACE + Project::ENGINE_VERSION + RPM::NEW_LINE + website + RPM
        ::NEW_LINE + RPM::NEW_LINE + RPM::translate(Translations::BUILT_ON) +
        RPM::SPACE + buildDate + RPM::NEW_LINE + RPM::NEW_LINE + RPM::translate(
        Translations::THANKS_PATREON) + RPM::COLON + RPM::NEW_LINE + RPM
        ::NEW_LINE + patreonThanks + RPM::NEW_LINE + RPM::NEW_LINE + RPM
        ::translate(Translations::THANKS_PATREON_PREVIOUS) + RPM::COLON + RPM::
        NEW_LINE + RPM::NEW_LINE + patreonPreviousThanks + RPM::NEW_LINE + RPM
        ::NEW_LINE + copyright);
}

// -------------------------------------------------------

void MainWindow::checkUpdate() {
    QMessageBox::information(this, RPM::translate(Translations::RESTART), RPM
        ::translate(Translations::ENGINE_GOING_RESTARTED) + RPM::DOT);
    QString realApplicationName;
    #ifdef Q_OS_WIN
        realApplicationName = "RPG Paper Maker temp.exe";
    #elif __linux__
        realApplicationName = "run-temp.sh";
    #else
        realApplicationName = "RPG-Paper-Maker-temp.app";
    #endif
    QString path = Common::pathCombine(QDir::currentPath(), realApplicationName);
    QStringList arguments = qApp->arguments();
    arguments[0] = path;

    qApp->quit();
    QProcess::startDetached(path, arguments);
}

// -------------------------------------------------------

void MainWindow::openRecentProject(QString path) {
    this->openProject(path);
}

// -------------------------------------------------------

void MainWindow::on_gameErrorOccurred(QProcess::ProcessError)
{
    if (m_firstCrash)
    {
        m_firstCrash = false;
        QString strOS = "";
        QString exeName = "";
        #ifdef Q_OS_WIN
            strOS = "win32";
            exeName = "Game.exe";
        #elif __linux__
            strOS = "linux";
            exeName = "Game";
        #else
            strOS = "osx";
        #endif

        // Copying exe from engine folder
        if (!exeName.isEmpty())
        {
            QString pathSrc = Common::pathCombine(Common::pathCombine(Common
                ::pathCombine(QDir::currentPath(), RPM::FOLDER_CONTENT), strOS), exeName);
            QString pathDst = Common::pathCombine(project->pathCurrentProject(), exeName);
            QFile(pathDst).remove();
            QFile::copy(pathSrc, pathDst);

            // Restart game
            this->runGame();
        }
    }
}

// -------------------------------------------------------

void MainWindow::updateBackup() {
    if (project != nullptr) {
        QString pathBackups = Common::pathCombine(project->pathCurrentProject(),
            RPM::FOLDER_BACKUPS);
        QDir dirProject(project->pathCurrentProject());
        if (!dirProject.exists(RPM::FOLDER_BACKUPS))
        {
            QDir(project->pathCurrentProject()).mkdir(RPM::FOLDER_BACKUPS);
        }

        // Get backup index
        QDir dir(pathBackups);
        int index;
        QStringList list;
        foreach (QFileInfo id, dir.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot))
        {
            QString d = id.fileName();
            index = d.at(0).unicode() - 1;
            list.insert(index, d);
        }
        index = list.size();

        // Do backup
        QString folderBackup = QString::number(index + 1) + "~" + Common
            ::getFormatNumber(QDateTime::currentDateTime().date().day(), 2) +
            RPM::DASH + Common::getFormatNumber(QDateTime::currentDateTime()
            .date().month(), 2) + RPM::DASH + Common::getFormatNumber(QDateTime
            ::currentDateTime().date().year()) + RPM::DASH + Common
            ::getFormatNumber(QTime::currentTime().hour(), 2) + RPM::COLON +
            Common::getFormatNumber(QTime::currentTime().minute(), 2);
        dir.mkdir(folderBackup);
        Common::copyPath(Common::pathCombine(project->pathCurrentProjectApp(),
            RPM::FOLDER_CONTENT), Common::pathCombine(Common::pathCombine(
            pathBackups, folderBackup), RPM::FOLDER_CONTENT));

        // If max reached, remove first index and remove others
        if (index == MAX_BACKUPS) {
            QDir(Common::pathCombine(pathBackups, list.at(0))).removeRecursively();
            QString oldName, newName;
            list << folderBackup;
            for (int i = 1; i <= MAX_BACKUPS; i++) {
                oldName = list.at(i);
                newName = oldName;
                newName.replace(0, 1, QString::number(i));
                dir.rename(oldName, newName);
            }
        }
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void MainWindow::closeEvent(QCloseEvent * event){
    if (!close())
    {
        event->ignore();
    }
}
