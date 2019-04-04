/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
}

DialogSpecialElements::~DialogSpecialElements()
{
    delete ui;
}
