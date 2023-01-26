/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettilesettexture.h"
#include "ui_widgettilesettexture.h"
#include "dialogtilesettexture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetTexture::WidgetTilesetTexture(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTilesetTexture),
    m_rect(0, 0, 1, 1)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(),
                            ui->listWidget->height() - 4));
    ui->listWidget->addItem(item);
    this->updateText();
}

WidgetTilesetTexture::~WidgetTilesetTexture()
{
    delete ui;
}

void WidgetTilesetTexture::getRect(QRect &rect) const {
    rect = m_rect;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetTexture::initialize(int pictureID) {
    WidgetTilesetTexture::m_pictureID = pictureID;
}

// -------------------------------------------------------

void WidgetTilesetTexture::updateText() {
    ui->listWidget->item(0)->setText("[" + QString::number(m_rect.x()) + "," +
        QString::number(m_rect.y()) + "," + QString::number(m_rect.width()) +
        "," + QString::number(m_rect.height()) + "]");
}

// -------------------------------------------------------

void WidgetTilesetTexture::openDialog() {
    DialogTilesetTexture dialog(m_pictureID, m_rect);

    if (dialog.exec() == QDialog::Accepted){
        m_rect = dialog.getRect();
        updateText();
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
