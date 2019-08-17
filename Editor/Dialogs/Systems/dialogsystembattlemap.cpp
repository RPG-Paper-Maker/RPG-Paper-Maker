/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogsystembattlemap.h"
#include "ui_dialogsystembattlemap.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemBattleMap::DialogSystemBattleMap(SystemBattleMap &battleMap,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemBattleMap),
    m_battleMap(battleMap)
{
    Position3D position;

    ui->setupUi(this);

    ui->panelPrimitiveCameraPropertiesID->initializeDataBaseAndUpdate(battleMap
        .cameraPropertiesID());
    position = battleMap.position();
    ui->panelSelectPositionMaps->initialize(battleMap.idMap(), position.x(),
        position.y(), position.getYpx(RPM::getSquareSize()), position.z());
}

DialogSystemBattleMap::~DialogSystemBattleMap()
{
    delete ui;
}

//--------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
//--------------------------------------------

TreeMapTag * DialogSystemBattleMap::currentTag() const {
    return ui->panelSelectPositionMaps->currentTag();
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogSystemBattleMap::accept() {
    if (currentTag()->isDir()) {
        QMessageBox::warning(this, "Warning", "You should select a map and not "
            "a folder.");
    } else {
        Position3D position(ui->panelSelectPositionMaps->x(), ui
            ->panelSelectPositionMaps->y(), ui->panelSelectPositionMaps->yPlus()
            , ui->panelSelectPositionMaps->z());
        m_battleMap.setIDMap(ui->panelSelectPositionMaps->idMap());
        m_battleMap.setPosition(position);
        QDialog::accept();
    }
}
