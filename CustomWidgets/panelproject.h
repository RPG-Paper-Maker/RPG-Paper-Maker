/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    WidgetMapEditor * widgetMapEditor() const;
    WidgetTreeLocalMaps * widgetTreeLocalMaps() const;

private:
    Ui::PanelProject *ui;
    Project *m_project;
    QTimer *m_timerUpdate;

public slots:
    void updateMenu();
    void on_menuBarPressed();
};

#endif // PANELPROJECT_H
