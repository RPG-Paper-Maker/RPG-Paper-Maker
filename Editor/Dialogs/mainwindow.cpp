/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    p_appName = "RPG Paper Maker";
    gameProcess = new QProcess(this);
    project = nullptr;

    ui->setupUi(this);

    // Setting window title
    this->setWindowTitle(p_appName + " v." + Project::ENGINE_VERSION);

    // Update main panel
    mainPanel = new PanelMainMenu(this);
    ui->centralWidget->layout()->addWidget(mainPanel);
    connect(mainPanel, SIGNAL(openingProject(QString)), this, SLOT(
        openRecentProject(QString)));

    // Add actions for recent projects
    updateMenuRecentProjects();

    // Menu bar enabled actions
    enableNoGame();
}

MainWindow::~MainWindow()
{
    delete ui;
    gameProcess->close();
    delete gameProcess;
    gameProcess = nullptr;
    cleanRecentProjectsActions();
    RPM::kill();
}

QString MainWindow::appName() const{ return p_appName; }

QString MainWindow::version() const{ return p_version; }

WidgetMapEditor* MainWindow::mapEditor() const{
    return ((PanelProject*)mainPanel)->widgetMapEditor();
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
    QString file = QFileDialog::getOpenFileName(this, "Open a project",
                                                RPM::dirGames,
                                                "RPG Paper Maker (*.rpm)");
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
    ui->actionExport_standalone->setEnabled(b);
    ui->actionClose_project->setEnabled(b);
    ui->actionUndo->setEnabled(b);
    ui->actionRedo->setEnabled(b);
    ui->actionDatas_manager->setEnabled(b);
    ui->actionSystems_manager->setEnabled(b);
    ui->actionVariables_manager->setEnabled(b);
    ui->actionSongs_manager->setEnabled(b);
    ui->actionShapes_manager->setEnabled(b);
    ui->actionPictures_manager->setEnabled(b);
    ui->actionSet_BR_path_folder->setEnabled(b);
    ui->actionDebug_options->setEnabled(b);
    ui->actionKeyboard_controls->setEnabled(b);
    ui->actionCollisions_manager->setEnabled(b);
    ui->actionScripts_manager->setEnabled(b);
    ui->actionAutotiles->setEnabled(b);
    ui->actionSprite_walls->setEnabled(b);
    ui->action3D_objects->setEnabled(b);
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
    ui->actionExport_standalone->setEnabled(true);
    ui->actionClose_project->setEnabled(true);
    ui->actionUndo->setEnabled(true);
    ui->actionRedo->setEnabled(true);
    ui->actionDatas_manager->setEnabled(true);
    ui->actionSystems_manager->setEnabled(true);
    ui->actionVariables_manager->setEnabled(true);
    ui->actionSongs_manager->setEnabled(true);
    ui->actionPictures_manager->setEnabled(true);
    ui->actionShapes_manager->setEnabled(true);
    ui->actionSet_BR_path_folder->setEnabled(true);
    ui->actionDebug_options->setEnabled(true);
    ui->actionKeyboard_controls->setEnabled(true);
    ui->actionCollisions_manager->setEnabled(true);
    ui->actionAutotiles->setEnabled(true);
    ui->actionSprite_walls->setEnabled(true);
    ui->action3D_objects->setEnabled(true);
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
            QMessageBox::StandardButton box =
                    QMessageBox::question(this, "Quit",
                                          "You have some maps that are not "
                                          "saved. Do you want to save all?",
                                          QMessageBox::Yes | QMessageBox::No |
                                          QMessageBox::Cancel);

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
    int oldSquareSize = project->gameDatas()->systemDatas()->squareSize();
    if (openDialog(dialog) == QDialog::Accepted) {
        // If square size different, update all maps camera distance
        int newSquareSize = dialog.getSquareSize();
        if (newSquareSize != oldSquareSize)
            ((PanelProject*)mainPanel)->widgetMapEditor()
                ->updateCameraDistance(newSquareSize / ((float) oldSquareSize));
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

void MainWindow::on_actionShapes_manager_triggered() {
    DialogShapes dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeShapesDatas();
    else
        project->readShapesDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionKeyboard_controls_triggered(){
    DialogKeyBoardControls dialog(project, RPM::get()->engineSettings());
    if (openDialog(dialog) == QDialog::Accepted){
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

void MainWindow::on_actionCollisions_manager_triggered() {
    DialogCollisions dialog;
    if (openDialog(dialog) == QDialog::Accepted)
        project->writePicturesDatas();
    else
        project->readPicturesDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionAutotiles_triggered() {
    DialogSpecialElements dialog(PictureKind::Autotiles);
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSpecialsDatas();
    else
        project->readSpecialsDatas();

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSprite_walls_triggered() {
    DialogSpecialElements dialog(PictureKind::Walls);
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSpecialsDatas();
    else
        project->readSpecialsDatas();

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_action3D_objects_triggered() {
    DialogSpecialElements dialog(PictureKind::Object3D);
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSpecialsDatas();
    else
        project->readSpecialsDatas();

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionMountains_triggered() {
    DialogSpecialElements dialog(PictureKind::Mountains);
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeSpecialsDatas();
    else
        project->readSpecialsDatas();

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSet_BR_path_folder_triggered(){
    DialogLocation dialog(project->gameDatas()->systemDatas()->pathBR());
    if (openDialog(dialog) == QDialog::Accepted){
        project->gameDatas()->systemDatas()->setPathBR(dialog.location());
        project->writeSystemDatas();
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

void MainWindow::on_actionShow_Hide_grid_triggered() {
    ((PanelProject*)mainPanel)->widgetMapEditor()->showHideGrid();
}

// -------------------------------------------------------

void MainWindow::on_actionShow_Hide_square_informations_triggered() {
    ((PanelProject*)mainPanel)->widgetMapEditor()->showHideSquareInformations();
}

// -------------------------------------------------------

void MainWindow::on_actionPlay_triggered(){
    if (RPM::mapsToSave.count() > 0) {
        QMessageBox::StandardButton box =
                QMessageBox::question(this, "Save",
                                      "You have some maps that are not saved. "
                                      "Do you want to save all?",
                                      QMessageBox::Yes | QMessageBox::No |
                                      QMessageBox::Cancel);

        if (box == QMessageBox::Yes)
            saveAllMaps();
        else if (box == QMessageBox::Cancel)
            return;
    }

    // Play process
    QString execName = "Game";
    #ifdef Q_OS_WIN
        execName += ".exe";
    #elif __linux__
        execName += ".sh";
    #else
        execName += ".app";
    #endif

    if (gameProcess->isOpen())
        gameProcess->close();
    gameProcess->start("\"" + Common::pathCombine(project->pathCurrentProject(),
                                                 execName) + "\"");
}

// -------------------------------------------------------

void MainWindow::on_actionAbout_triggered() {
    QString name, website, buildDate, copyright;
    QStringList patreonThanks;
    patreonThanks << "Utrano" << "Florian Dufour" << "Elias Luukkanen";

    name = "RPG Paper Maker";
    website = "http://rpg-paper-maker.com/";
    buildDate = Project::LAST_BUILD_DATE;
    copyright = "RPG Paper Maker Copyright (C) 2017-2019 Wano\n\n"
        "RPG Paper Maker is free for non commercial use. You don't have any fee "
        "to pay as long as you don't plan to publish commercial games done with "
        "RPG Paper Maker.";

    QMessageBox::about(this, "About", name + " " + Project::ENGINE_VERSION +
        "\n" + website + "\n\nBuilt on " + buildDate +
        "\n\nPatreon special thanks: " + patreonThanks.join(", ") + "\n\n" +
        copyright);
}

// -------------------------------------------------------

void MainWindow::checkUpdate() {
    QMessageBox::information(this, "Restart",
                             "The engine is going to be restarted.");

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
//
//  EVENTS
//
// -------------------------------------------------------

void MainWindow::closeEvent(QCloseEvent * event){
    if (!close())
        event->ignore();
}
