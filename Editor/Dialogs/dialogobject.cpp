/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
}

DialogObject::~DialogObject()
{
    delete ui;
}
