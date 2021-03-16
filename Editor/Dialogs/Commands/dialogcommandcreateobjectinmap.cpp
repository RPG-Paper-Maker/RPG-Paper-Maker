/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandcreateobjectinmap.h"
#include "ui_dialogcommandcreateobjectinmap.h"

DialogCommandCreateObjectInMap::DialogCommandCreateObjectInMap(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogCommandCreateObjectInMap)
{
    ui->setupUi(this);
}

DialogCommandCreateObjectInMap::~DialogCommandCreateObjectInMap()
{
    delete ui;
}
