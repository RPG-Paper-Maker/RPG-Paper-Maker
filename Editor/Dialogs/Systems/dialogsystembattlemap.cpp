/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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

    position = battleMap.position();
    ui->panelSelectPositionMaps->initialize(battleMap.idMap(), position.x(),
        position.y(), position.getYpx(RPM::getSquareSize()), position.z());

    this->translate();
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

//-------------------------------------------------

void DialogSystemBattleMap::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_BATTLE_MAP) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogSystemBattleMap::accept() {
    if (currentTag()->isDir()) {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::YOU_SHOULD_SELECT_MAP_NOT_FOLDER));
    } else {
        Position3D position(ui->panelSelectPositionMaps->x(), ui
            ->panelSelectPositionMaps->y(), ui->panelSelectPositionMaps->yPlus()
            , ui->panelSelectPositionMaps->z());
        m_battleMap.setIDMap(ui->panelSelectPositionMaps->idMap());
        m_battleMap.setPosition(position);
        QDialog::accept();
    }
}
