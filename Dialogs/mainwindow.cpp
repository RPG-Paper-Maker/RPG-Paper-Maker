/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
#include "dialogexport.h"
#include "panelmainmenu.h"
#include "panelproject.h"
#include "wanok.h"
#include "widgettreelocalmaps.h"
#include "dialoglocation.h"
#include "dialogprogress.h"
#include "dialogengineupdate.h"
#include "dialogspecialelements.h"

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

    // Menu bar enabled actions
    enableNoGame();

    // Check update
    QThread* thread = new QThread(parent);
    m_engineUpdater = new EngineUpdater();
    m_engineUpdater->moveToThread(thread);
    connect(thread, SIGNAL(started()), m_engineUpdater, SLOT(check()));
    connect(m_engineUpdater, SIGNAL(finishedCheck(bool)),
            this, SLOT(on_updateCheckFinished(bool)));
    thread->start();

    //EngineUpdater::writeBasicJSONFile();
}

MainWindow::~MainWindow()
{
    delete ui;
    delete m_engineUpdater;
    gameProcess->close();
    delete gameProcess;
    gameProcess = nullptr;
    Wanok::kill();
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
        openProject(Wanok::pathCombine(dialog.getLocation(),
                                       dialog.getDirectoryName()));
    }
}

// -------------------------------------------------------

void MainWindow::openExistingProject(){
    QString file = QFileDialog::getOpenFileName(this, "Open a project",
                                                Wanok::dirGames,
                                                "RPG Paper Maker (*.rpm)");
    if (file.count() > 0) openProject(Wanok::getDirectoryPath(file));
}

// -------------------------------------------------------

void MainWindow::openProject(QString pathProject) {
    if ((project != nullptr && closeProject()) || project == nullptr){
        project = new Project;
        Wanok::get()->setProject(project);

        if (project->read(pathProject)) {
            enableGame();
            replaceMainPanel(new PanelProject(this, project));
        }
        else {
            delete project;
            project = nullptr;
            Wanok::get()->setProject(nullptr);
        }
    }
}

// -------------------------------------------------------

bool MainWindow::closeProject(){
    if (!close())
        return false;

    Wanok::mapsToSave.clear();
    Wanok::mapsUndoRedo.clear();
    enableNoGame();
    delete project;
    project = nullptr;
    Wanok::get()->setProject(nullptr);
    WidgetMapEditor* mapEditor = ((PanelProject*)mainPanel)->widgetMapEditor();
    mapEditor->setVisible(false);
    replaceMainPanel(new PanelMainMenu(this));

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
    ui->actionPictures_manager->setEnabled(b);
    ui->actionSet_BR_path_folder->setEnabled(b);
    ui->actionKeyboard_controls->setEnabled(b);
    ui->actionAutotiles->setEnabled(b);
    ui->actionSprite_walls->setEnabled(b);
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
    ui->actionPictures_manager->setEnabled(true);
    ui->actionSet_BR_path_folder->setEnabled(true);
    ui->actionKeyboard_controls->setEnabled(true);
    ui->actionAutotiles->setEnabled(true);
    ui->actionSprite_walls->setEnabled(true);
    ui->actionShow_Hide_grid->setEnabled(true);
    ui->actionShow_Hide_square_informations->setEnabled(true);
    ui->actionPlay->setEnabled(true);
}

// -------------------------------------------------------

void MainWindow::saveAllMaps(){

    // Save all the maps
    QSet<int>::iterator i;
    for (i = Wanok::mapsToSave.begin(); i != Wanok::mapsToSave.end(); i++){
        Map map(*i);
        map.save();
    }
    if (project->currentMap() != nullptr)
        project->currentMap()->setSaved(true);
    Wanok::mapsToSave.clear();

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

void MainWindow::openEngineUpdater() {
    QJsonArray tab;
    m_engineUpdater->getVersions(tab);

    DialogEngineUpdate dialog(tab);
    if (openDialog(dialog) == QDialog::Accepted) {
        DialogProgress dialog;
        connect(m_engineUpdater, SIGNAL(finished()),
                this, SLOT(on_updateFinished()));
        connect(m_engineUpdater, SIGNAL(progress(int, QString)),
                &dialog, SLOT(setValueLabel(int, QString)));
        connect(m_engineUpdater, SIGNAL(progress(int, QString)),
                &dialog, SLOT(setValueLabel(int, QString)));
        connect(m_engineUpdater, SIGNAL(needUpdate()),
                m_engineUpdater, SLOT(update()));
        m_engineUpdater->start();
        dialog.exec();
    }
}

// -------------------------------------------------------

bool MainWindow::close() {
    if (project != nullptr) {
        if (Wanok::mapsToSave.count() > 0){
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
        Wanok::mapsToSave.remove(project->currentMap()->mapProperties()->id());
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
    if (project->currentMap() != nullptr)
        ((PanelProject*)mainPanel)->widgetMapEditor()->undo();
}

// -------------------------------------------------------

void MainWindow::on_actionRedo_triggered() {
    if (project->currentMap() != nullptr)
        ((PanelProject*)mainPanel)->widgetMapEditor()->redo();
}

// -------------------------------------------------------

void MainWindow::on_actionDatas_manager_triggered(){
    Wanok::isInConfig = true;
    DialogDatas dialog(project->gameDatas());
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeGameDatas();
    else
        project->readGameDatas();
    Wanok::isInConfig = false;

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionSystems_manager_triggered(){
    Wanok::isInConfig = true;
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
    Wanok::isInConfig = false;

    updateTextures();
}

// -------------------------------------------------------

void MainWindow::on_actionVariables_manager_triggered(){
    DialogVariables dialog;
    dialog.initializeModel(project->gameDatas()->variablesDatas()->model());
    openDialog(dialog);
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

void MainWindow::on_actionKeyboard_controls_triggered(){
    DialogKeyBoardControls dialog(project, Wanok::get()->engineSettings());
    if (openDialog(dialog) == QDialog::Accepted){
        Wanok::get()->saveEngineSettings();
        project->writeKeyBoardDatas();
        project->readKeyBoardDatas();
    }
    else{
        Wanok::get()->loadEngineSettings();
        project->readKeyBoardDatas();
    }
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

void MainWindow::on_actionSet_BR_path_folder_triggered(){
    DialogLocation dialog(project->gameDatas()->systemDatas()->pathBR());
    if (openDialog(dialog) == QDialog::Accepted){
        project->gameDatas()->systemDatas()->setPathBR(dialog.location());
        project->writeSystemDatas();
    }
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
    if (Wanok::mapsToSave.count() > 0) {
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

    gameProcess->start("\"" + Wanok::pathCombine(project->pathCurrentProject(),
                                                 execName) + "\"");
}

// -------------------------------------------------------

void MainWindow::on_updateCheckFinished(bool b) {
    if (b)
        openEngineUpdater();
}

// -------------------------------------------------------

void MainWindow::on_updateFinished() {

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
    QString path = Wanok::pathCombine(QDir::currentPath(), realApplicationName);
    QStringList arguments = qApp->arguments();
    arguments[0] = path;

    qApp->quit();
    QProcess::startDetached(path, arguments);
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
