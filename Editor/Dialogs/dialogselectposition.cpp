/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogselectposition.h"
#include "ui_dialogselectposition.h"
#include "rpm.h"
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
    m_treeMapDatas->read(RPM::get()->project()->pathCurrentProject());
    ui->treeViewLocalMaps->initializeModel(m_treeMapDatas->model());

    ui->widgetMap->initializeSpinBoxesCoords(ui->spinBoxX, ui->spinBoxZ);

    // Initialize coords
    QVector3D position(x * RPM::get()->getSquareSize(),
                       y * RPM::get()->getSquareSize() + yPlus,
                       z * RPM::get()->getSquareSize());
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
    ui->widgetMap->setCursorY(i, ui->spinBoxYplus->value());
}

//--------------------------------------------

void DialogSelectPosition::on_spinBoxYplus_valueChanged(int i){
    ui->widgetMap->setCursorY(ui->spinBoxY->value(), i);
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
