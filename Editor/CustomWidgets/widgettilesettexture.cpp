/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettilesettexture.h"
#include "ui_widgettilesettexture.h"
#include "dialogtilesettexture.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetTexture::WidgetTilesetTexture(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTilesetTexture)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(),
                            ui->listWidget->height() - 4));
    ui->listWidget->addItem(item);
}

WidgetTilesetTexture::~WidgetTilesetTexture()
{
    delete ui;
}


// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetTexture::initialize(int pictureID) {
    m_pictureID = pictureID;
}

// -------------------------------------------------------

void WidgetTilesetTexture::openDialog() {
    DialogTilesetTexture dialog(m_pictureID);

    if (dialog.exec() == QDialog::Accepted){

    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTilesetTexture::on_listWidget_itemDoubleClicked(QListWidgetItem *) {
    openDialog();
}

// -------------------------------------------------------

void WidgetTilesetTexture::on_pushButton_clicked() {
    openDialog();
}
