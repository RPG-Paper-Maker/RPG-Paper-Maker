/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogobject.h"
#include "ui_dialogobject.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogObject::DialogObject(SystemCommonObject *object, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogObject)
{
    ui->setupUi(this);

    ui->widget->initializeList(RPM::get()->project()->gameDatas()
                               ->commonEventsDatas()->modelCommonObjects());
    ui->widget->initializeModel(object);
    ui->widget->updateModel();

    this->translate();
}

DialogObject::~DialogObject()
{
    delete ui;
}

//-------------------------------------------------

void DialogObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::OBJECT) + RPM::DOT_DOT_DOT);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
