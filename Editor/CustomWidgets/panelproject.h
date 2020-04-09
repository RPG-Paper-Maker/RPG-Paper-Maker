/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPROJECT_H
#define PANELPROJECT_H

#include <QWidget>
#include <widgetmapeditor.h>
#include "project.h"
#include "widgettreelocalmaps.h"

// -------------------------------------------------------
//
//  CLASS PanelProject
//
//  The main menu panel when a project is opened.
//
// -------------------------------------------------------

class WidgetTreeLocalMaps;

namespace Ui {
class PanelProject;
}

class PanelProject : public QWidget
{
    Q_OBJECT

public:
    explicit PanelProject(QWidget *parent = nullptr);
    PanelProject(QWidget *parent, Project *p);
    ~PanelProject();

    Project* project() const;
    PanelTextures * panelTextures() const;
    WidgetMapEditor * widgetMapEditor() const;
    WidgetTreeLocalMaps * widgetTreeLocalMaps() const;

private:
    Ui::PanelProject *ui;
    Project *m_project;
    QTimer *m_timerUpdate;

    void translate();

public slots:
    void updateMenu();
    void on_menuBarPressed();
};

#endif // PANELPROJECT_H
