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

#include "panelproject.h"
#include "ui_panelproject.h"
#include <QDebug>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelProject::PanelProject(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelProject)
{
    ui->setupUi(this);

    // Set default proportion of splitters
    QList<int> sizes;
    sizes << 100 << 500;
    ui->splitter_2->setSizes(sizes);
    ui->openGLWidget->setMenuBar(ui->widgetMenuBar);
}

PanelProject::PanelProject(QWidget *parent, Project* p) :
    PanelProject(parent)
{
    m_project = p;
    ui->treeViewLocalMaps->initializeWidgetMapEditor(ui->openGLWidget);
    ui->treeViewLocalMaps->initializeWidgetMenuBar(ui->widgetMenuBar);
    ui->treeViewLocalMaps->initializeProject(m_project);
    ui->treeViewLocalMaps->initializeModel(m_project->treeMapDatas()->model());
}

PanelProject::~PanelProject()
{
    delete ui;
}

Project* PanelProject::project() const { return m_project; }

WidgetMapEditor* PanelProject::widgetMapEditor() const{
    return ui->openGLWidget;
}

WidgetTreeLocalMaps* PanelProject::widgetTreeLocalMaps() const{
    return ui->treeViewLocalMaps;
}
