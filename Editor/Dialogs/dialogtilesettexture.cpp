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

DialogTilesetTexture::DialogTilesetTexture(int pictureID, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTilesetTexture)
{
    ui->setupUi(this);

    ui->widget->setIsResizable(false);
    ui->widget->setImage(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::Tilesets)->invisibleRootItem(), pictureID))->getPath(PictureKind
        ::Tilesets));
}

DialogTilesetTexture::~DialogTilesetTexture()
{
    delete ui;
}
