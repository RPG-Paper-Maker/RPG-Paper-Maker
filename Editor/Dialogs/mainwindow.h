/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QProcess>
#include "controlmainwindow.h"
#include "project.h"
#include "widgetmapeditor.h"
#include "singleton.h"
#include "dialogscripts.h"

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

class MainWindow : public QMainWindow, public Singleton<MainWindow>
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
    ControlMainWindow control;
    QString appName() const;
    QString version() const;
    WidgetMapEditor * mapEditor() const;
    PanelTextures * panelTextures() const;
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
    bool close();
    void updateRecentProjects(QString projectName, QString path);
    void updateMenuRecentProjects();
    void cleanRecentProjectsActions();
    void translate();

private:
    Ui::MainWindow *ui;
    QWidget* mainPanel;
    QProcess* gameProcess;
    Project* project;
    int openDialog(QDialog& dialog);
    QString p_appName;
    QString p_version;
    bool m_isMainMenu;
    DialogScripts *m_dialogScripts;

    void updateTextures();

protected:
    virtual void closeEvent(QCloseEvent *event);

private slots:
    void on_actionNew_project_triggered();
    void on_actionBrowse_triggered();
    void on_actionSave_triggered();
    void on_actionSave_all_triggered();
    void on_actionOpen_project_folder_triggered();
    void on_actionExport_standalone_triggered();
    void on_actionClose_project_triggered();
    void on_actionQuit_triggered();
    void on_actionUndo_triggered();
    void on_actionRedo_triggered();
    void on_actionHeight_up_triggered();
    void on_actionHeight_plus_up_triggered();
    void on_actionHeight_down_triggered();
    void on_actionHeight_plus_down_triggered();
    void on_actionZoom_in_triggered();
    void on_actionZoom_out_triggered();
    void on_actionDatas_manager_triggered();
    void on_actionSystems_manager_triggered();
    void on_actionVariables_manager_triggered();
    void on_actionSongs_manager_triggered();
    void on_actionPictures_manager_triggered();
    void on_actionVideos_manager_triggered();
    void on_actionShapes_manager_triggered();
    void on_actionKeyboard_controls_triggered();
    void on_actionScripts_manager_triggered();
    void on_actionCollisions_manager_triggered();
    void on_actionAutotiles_triggered();
    void on_actionSprite_walls_triggered();
    void on_action3D_objects_triggered();
    void on_actionMountains_triggered();
    void on_actionSet_BR_path_folder_triggered();
    void on_actionSet_DLC_s_path_folder_triggered();
    void on_actionDebug_options_triggered();
    void on_actionGeneral_options_triggered();
    void on_actionChange_language_triggered();
    void on_actionShow_Hide_grid_triggered();
    void on_actionShow_Hide_square_informations_triggered();
    void on_actionPlay_triggered();
    void on_actionAuto_update_toggled(bool checked);
    void on_actionAbout_triggered();
    void checkUpdate();
    void openRecentProject(QString path);
};

#endif // MAINWINDOW_H
