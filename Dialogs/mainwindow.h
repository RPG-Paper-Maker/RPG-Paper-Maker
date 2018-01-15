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

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QProcess>
#include "controlmainwindow.h"
#include "project.h"
#include "widgetmapeditor.h"
#include "engineupdater.h"

// -------------------------------------------------------
//
//  CLASS MainWindow
//
//  The main window.
//
// -------------------------------------------------------

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
    ControlMainWindow control;
    QString appName() const;
    QString version() const;
    WidgetMapEditor* mapEditor() const;
    static void showNotImplementedWindow(QWidget* parent);
    void newProject();
    void openExistingProject();
    void openProject(QString pathProject);
    bool closeProject();
    void replaceMainPanel(QWidget* replacement);
    void enableAll(bool b);
    void enableNoGame();
    void enableGame();
    void saveAllMaps();
    void deleteTempMaps();
    void openEngineUpdater();
    bool close();

private:
    Ui::MainWindow *ui;
    QWidget* mainPanel;
    QProcess* gameProcess;
    Project* project;
    EngineUpdater* m_engineUpdater;
    int openDialog(QDialog& dialog);
    QString p_appName;
    QString p_version;

    void updateTextures();

private slots:
    void on_actionNew_project_triggered();
    void on_actionBrowse_triggered();
    void on_actionSave_triggered();
    void on_actionSave_all_triggered();
    void on_actionExport_standalone_triggered();
    void on_actionClose_project_triggered();
    void on_actionQuit_triggered();
    void on_actionUndo_triggered();
    void on_actionRedo_triggered();
    void on_actionDatas_manager_triggered();
    void on_actionSystems_manager_triggered();
    void on_actionVariables_manager_triggered();
    void on_actionPictures_manager_triggered();
    void on_actionKeyboard_controls_triggered();
    void on_actionAutotiles_triggered();
    void on_actionSprite_walls_triggered();
    void on_actionSet_BR_path_folder_triggered();
    void on_actionShow_Hide_grid_triggered();
    void on_actionShow_Hide_square_informations_triggered();
    void on_actionPlay_triggered();
    void on_updateCheckFinished(bool b);
    void on_updateFinished();
    void closeEvent(QCloseEvent *event);
};

#endif // MAINWINDOW_H
