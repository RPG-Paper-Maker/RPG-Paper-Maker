/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemrandombattle.h"
#include "ui_dialogsystemrandombattle.h"

DialogSystemRandomBattle::DialogSystemRandomBattle(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemRandomBattle)
{
    ui->setupUi(this);
}

DialogSystemRandomBattle::~DialogSystemRandomBattle()
{
    delete ui;
}
