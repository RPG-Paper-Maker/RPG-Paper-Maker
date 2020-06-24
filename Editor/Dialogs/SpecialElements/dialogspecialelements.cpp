/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogspecialelements.h"
#include "ui_dialogspecialelements.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSpecialElements::DialogSpecialElements(PictureKind kind,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSpecialElements)
{
    ui->setupUi(this);
    

    setWindowTitle(SystemPicture::getPictureTitle(kind));
    ui->widget->initialize(
                RPM::get()->project()->specialElementsDatas()->model(kind),
                kind);

    this->translate();
}

DialogSpecialElements::~DialogSpecialElements()
{
    delete ui;
}

//-------------------------------------------------

void DialogSpecialElements::translate()
{
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
