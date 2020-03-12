/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelselectpositionmaps.h"
#include "ui_panelselectpositionmaps.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSelectPositionMaps::PanelSelectPositionMaps(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSelectPositionMaps),
    m_treeMapDatas(new TreeMapDatas)
{
    ui->setupUi(this);

    ui->treeViewLocalMaps->initializeWidgetMapEditor(ui->widgetMap);
    m_treeMapDatas->read(RPM::get()->project()->pathCurrentProject());
    ui->treeViewLocalMaps->initializeModel(m_treeMapDatas->model());

    this->translate();
}

PanelSelectPositionMaps::~PanelSelectPositionMaps()
{
    delete ui;
    delete m_treeMapDatas;
}

int PanelSelectPositionMaps::idMap() const{
    return currentTag()->id();
}

QString PanelSelectPositionMaps::mapName() const {
    return currentTag()->name();
}

int PanelSelectPositionMaps::x() const {
    return ui->spinBoxX->value();
}

int PanelSelectPositionMaps::y() const {
    return ui->spinBoxY->value();
}

int PanelSelectPositionMaps::yPlus() const {
    return ui->spinBoxYplus->value();
}

int PanelSelectPositionMaps::z() const {
    return ui->spinBoxZ->value();
}

//--------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
//--------------------------------------------

TreeMapTag * PanelSelectPositionMaps::currentTag() const {
    return reinterpret_cast<TreeMapTag*>(ui->treeViewLocalMaps->getSelected()
        ->data().value<quintptr>());
}

//--------------------------------------------

void PanelSelectPositionMaps::initialize(int idMap, int x, int y, int yPlus, int
    z)
{
    ui->widgetMap->initializeSpinBoxesCoords(ui->spinBoxX, ui->spinBoxY, ui
        ->spinBoxYplus, ui->spinBoxZ);
    ui->spinBoxYplus->setMaximum(RPM::get()->getSquareSize() - 1);

    // Initialize coords
    QVector3D position(x * RPM::get()->getSquareSize(), y * RPM::get()
        ->getSquareSize() + yPlus, z * RPM::get()->getSquareSize());
    ui->treeViewLocalMaps->setMap(idMap, position);
}

//-------------------------------------------------

void PanelSelectPositionMaps::translate()
{
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->labelYPlus->setText(RPM::translate(Translations::Y_PLUS) + RPM::COLON);
    ui->groupBoxCoordinates->setTitle(RPM::translate(Translations::COORDINATES));
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void PanelSelectPositionMaps::on_spinBoxX_valueChanged(int i){
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

void PanelSelectPositionMaps::on_spinBoxY_valueChanged(int i) {
    Map* map = ui->widgetMap->getMap();
    if (map != nullptr) {
        MapProperties* properties = map->mapProperties();
        if (i >= properties->height()) {
            i = properties->height() - 1;
            ui->spinBoxY->setValue(i);
        } else if (i < -properties->depth()) {
            i = -properties->depth();
            ui->spinBoxY->setValue(i);
        }
        ui->widgetMap->setCursorY(i, ui->spinBoxYplus->value());
    } else {
        ui->spinBoxY->setValue(0);
    }
}

//--------------------------------------------

void PanelSelectPositionMaps::on_spinBoxYplus_valueChanged(int i) {
    ui->widgetMap->setCursorY(ui->spinBoxY->value(), i);
}

//--------------------------------------------

void PanelSelectPositionMaps::on_spinBoxZ_valueChanged(int i){
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
