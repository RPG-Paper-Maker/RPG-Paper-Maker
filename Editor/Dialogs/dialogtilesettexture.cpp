/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogtilesettexture.h"
#include "ui_dialogtilesettexture.h"
#include "systempicture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTilesetTexture::DialogTilesetTexture(int pictureID, QRect &rect, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogTilesetTexture)
{
    ui->setupUi(this);

    ui->widget->setIsResizable(false);
    ui->widget->setImage(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::Tilesets)->invisibleRootItem(), pictureID))->getPath(PictureKind
        ::Tilesets));
    ui->widget->setCurrentTexture(rect);

    this->translate();
}

DialogTilesetTexture::~DialogTilesetTexture()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY
//
// -------------------------------------------------------

QRect DialogTilesetTexture::getRect() const {
    QRect rect;
    ui->widget->currentTexture(rect);

    return rect;
}

//-------------------------------------------------

void DialogTilesetTexture::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
