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
#include "dialogkeyboardcontrols.h"
#include "dialogexport.h"
#include "panelmainmenu.h"
#include "panelproject.h"
#include "wanok.h"
#include "widgettreelocalmaps.h"

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
    p_version = "0.0.0";
    gameProcess = new QProcess(this);
    project = nullptr;

    ui->setupUi(this);

    // Setting window title
    this->setWindowTitle(p_appName + " - v." + p_version);

    // Update main panel
    mainPanel = new PanelMainMenu(this);
    ui->centralWidget->layout()->addWidget(mainPanel);

    // Menu bar enabled actions
    enableNoGame();
}

MainWindow::~MainWindow()
{
    delete ui;
    gameProcess->close();
    delete gameProcess;
    gameProcess = nullptr;
    Wanok::kill();
}

// Gets

QString MainWindow::appName() const{ return p_appName; }
QString MainWindow::version() const{ return p_version; }

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

void MainWindow::openProject(QString pathProject){
    if ((project != nullptr && closeProject()) || project == nullptr){
        enableGame();
        project = new Project;
        Wanok::get()->setProject(project);
        project->read(pathProject);
        replaceMainPanel(new PanelProject(this, project));
    }
}

// -------------------------------------------------------

bool MainWindow::closeProject(){
    if (Wanok::mapsToSave.count() > 0){
        QMessageBox::StandardButton box =
                QMessageBox::question(this, "Close project",
                                      "You have some maps that are not saved. "
                                      "Do you want to save all?",
                                      QMessageBox::Yes | QMessageBox::No |
                                      QMessageBox::Cancel);

        if (box == QMessageBox::Yes)
            saveAllMaps();
        else if (box == QMessageBox::No)
            deleteTempMaps();
        else
            return false;
    }
    else
        deleteTempMaps();

    Wanok::mapsToSave.clear();
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
    ui->actionDatas_manager->setEnabled(b);
    ui->actionSystems_manager->setEnabled(b);
    ui->actionVariables_manager->setEnabled(b);
    ui->actionSwitches_manager->setEnabled(b);
    ui->actionKeyboard_controls->setEnabled(b);
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
    ui->actionDatas_manager->setEnabled(true);
    ui->actionSystems_manager->setEnabled(true);
    ui->actionVariables_manager->setEnabled(true);
    ui->actionSwitches_manager->setEnabled(true);
    ui->actionKeyboard_controls->setEnabled(true);
    ui->actionPlay->setEnabled(true);
}

// -------------------------------------------------------

void MainWindow::saveAllMaps(){

    // Save all the maps
    QSet<int>::iterator i;
    for (i = Wanok::mapsToSave.begin(); i != Wanok::mapsToSave.end(); i++){
        Map map(*i);
        map.save(project->currentMap());
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
    if (project->currentMap() != nullptr){
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
    qApp->quit();
}

// -------------------------------------------------------

void MainWindow::on_actionDatas_manager_triggered(){
    DialogDatas dialog(project->gameDatas());
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeGameDatas();
    else
        project->readGameDatas();
}

// -------------------------------------------------------

void MainWindow::on_actionSystems_manager_triggered(){
    Wanok::isInConfig = true;
    DialogSystems dialog(project->gameDatas());
    if (openDialog(dialog) == QDialog::Accepted)
        project->writeGameDatas();
    else
        project->readGameDatas();
    Wanok::isInConfig = false;
}

// -------------------------------------------------------

void MainWindow::on_actionVariables_manager_triggered(){
    DialogVariables dialog;
    dialog.initializeModel(project->gameDatas()->variablesSwitchesDatas()
                           ->modelVariables());
    openDialog(dialog);
}

// -------------------------------------------------------

void MainWindow::on_actionSwitches_manager_triggered(){
    DialogVariables dialog;
    dialog.initializeModel(project->gameDatas()->variablesSwitchesDatas()
                           ->modelSwitches());
    dialog.applyAsSwitches();
    openDialog(dialog);
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

void MainWindow::on_actionPlay_triggered(){
    connect(gameProcess,
            SIGNAL(finished(int, QProcess::ExitStatus)), this,
            SLOT(on_gameProcessExit(int, QProcess::ExitStatus )));
    this->setEnabled(false);
    QString execName = "Game";
    #ifdef Q_OS_WIN
        execName += ".exe";
    #endif
    QString s = "\"" + Wanok::pathCombine(project->pathCurrentProject(),
                                          execName) + "\"";
    gameProcess->start("\"" + Wanok::pathCombine(project->pathCurrentProject(),
                                                 execName) + "\"");
}

// -------------------------------------------------------

void MainWindow::on_gameProcessExit(int exitCode,
                                    QProcess::ExitStatus exitStatus)
{
    if (exitCode != 0){
        QMessageBox::critical(this, "Error", "Process exited with " +
                              QString::number(exitCode) + " code exit. " +
                              exitStatus);
    }
    this->setEnabled(true);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void MainWindow::closeEvent(QCloseEvent * event){
    if (project != nullptr){
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
            else
                event->ignore();
        }
        else
            deleteTempMaps();
    }
}
