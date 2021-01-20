/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogselectposition.h"
#include "ui_dialogselectposition.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSelectPosition::DialogSelectPosition(int idMap, int x, int y, int yPlus,
    int z, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSelectPosition)
{
    ui->setupUi(this);

    ui->panelSelectPositionMaps->initialize(idMap, x, y, yPlus, z);

    this->translate();
}

DialogSelectPosition::~DialogSelectPosition()
{
    delete ui;
}

int DialogSelectPosition::idMap() const{
    return ui->panelSelectPositionMaps->idMap();
}

QString DialogSelectPosition::mapName() const {
    return ui->panelSelectPositionMaps->mapName();
}

int DialogSelectPosition::x() const {
    return ui->panelSelectPositionMaps->x();
}

int DialogSelectPosition::y() const {
    return ui->panelSelectPositionMaps->y();
}

int DialogSelectPosition::yPlus() const {
    return ui->panelSelectPositionMaps->yPlus();
}

int DialogSelectPosition::z() const {
    return ui->panelSelectPositionMaps->z();
}

//--------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
//--------------------------------------------

TreeMapTag * DialogSelectPosition::currentTag() const {
    return ui->panelSelectPositionMaps->currentTag();
}

//-------------------------------------------------

void DialogSelectPosition::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SELECT_MAP_POSITION) + RPM
        ::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogSelectPosition::accept() {
    if (currentTag()->isDir()) {
        QMessageBox::warning(this, RPM::translate(Translations::WARNING), RPM
            ::translate(Translations::YOU_SHOULD_SELECT_MAP_NOT_FOLDER) + RPM
            ::DOT);
    } else{
        QDialog::accept();
    }
}
