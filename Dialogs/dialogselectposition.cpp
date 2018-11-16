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

#include "dialogselectposition.h"
#include "ui_dialogselectposition.h"
#include "wanok.h"
#include <QMessageBox>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSelectPosition::DialogSelectPosition(
        int idMap,
        int x,
        int y,
        int yPlus,
        int z,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSelectPosition),
    m_treeMapDatas(new TreeMapDatas)
{
    ui->setupUi(this);
    ui->treeViewLocalMaps->initializeWidgetMapEditor(ui->widgetMap);
    m_treeMapDatas->read(Wanok::get()->project()->pathCurrentProject());
    ui->treeViewLocalMaps->initializeModel(m_treeMapDatas->model());

    ui->widgetMap->initializeSpinBoxesCoords(ui->spinBoxX, ui->spinBoxZ);

    // Initialize coords
    QVector3D position(x * Wanok::get()->getSquareSize(),
                       y * Wanok::get()->getSquareSize() + yPlus,
                       z * Wanok::get()->getSquareSize());
    ui->treeViewLocalMaps->setMap(idMap, position);
}

DialogSelectPosition::~DialogSelectPosition()
{
    delete ui;
    delete m_treeMapDatas;
}

int DialogSelectPosition::idMap() const{
    return currentTag()->id();
}

QString DialogSelectPosition::mapName() const {
    return currentTag()->name();
}

int DialogSelectPosition::x() const {
    return ui->spinBoxX->value();
}

int DialogSelectPosition::y() const {
    return ui->spinBoxY->value();
}

int DialogSelectPosition::yPlus() const {
    return ui->spinBoxYplus->value();
}

int DialogSelectPosition::z() const {
    return ui->spinBoxZ->value();
}

TreeMapTag* DialogSelectPosition::currentTag() const {
    return reinterpret_cast<TreeMapTag*>(ui->treeViewLocalMaps->getSelected()
        ->data().value<quintptr>());
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogSelectPosition::on_spinBoxX_valueChanged(int i){
    Map* map = ui->widgetMap->getMap();
    if (map != nullptr){
        MapProperties* properties = map->mapProperties();
        if (i >= properties->length()){
            i = properties->length() - 1;
            ui->spinBoxX->setValue(i);
        }
        ui->widgetMap->setCursorX(i);
    }
    else
        ui->spinBoxX->setValue(0);
}

//--------------------------------------------

void DialogSelectPosition::on_spinBoxY_valueChanged(int i){
    ui->widgetMap->setCursorY(i);
}

//--------------------------------------------

void DialogSelectPosition::on_spinBoxYplus_valueChanged(int i){
    ui->widgetMap->setCursorYplus(i);
}

//--------------------------------------------

void DialogSelectPosition::on_spinBoxZ_valueChanged(int i){
    Map* map = ui->widgetMap->getMap();
    if (map != nullptr){
        MapProperties* properties = map->mapProperties();
        if (i >= properties->width()){
            i = properties->width() - 1;
            ui->spinBoxZ->setValue(i);
        }
        ui->widgetMap->setCursorZ(i);
    }
    else
        ui->spinBoxZ->setValue(0);
}

// -------------------------------------------------------

void DialogSelectPosition::accept(){
    if (currentTag()->isDir()) {
        QMessageBox::warning(this, "Warning", "You should select a map and not "
            "a folder.");
    }
    else{
        QDialog::accept();
    }
}
