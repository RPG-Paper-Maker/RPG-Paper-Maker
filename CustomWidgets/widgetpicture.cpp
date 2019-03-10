/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "widgetpicture.h"
#include "ui_widgetpicture.h"
#include "picturesdatas.h"
#include "rpm.h"
#include "dialogpicturespreview.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPicture::WidgetPicture(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetPicture),
    m_pictureID(nullptr)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(),
                            ui->listWidget->height() - 4));
    ui->listWidget->addItem(item);
}

WidgetPicture::~WidgetPicture()
{
    delete ui;
}

SystemPicture* WidgetPicture::picture() const {
    return reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(m_kind)->invisibleRootItem(),
        m_picture));
}

QListWidget* WidgetPicture::list() const { return ui->listWidget; }

void WidgetPicture::setKind(PictureKind kind){
    m_kind = kind;
}

void WidgetPicture::setPicture(SystemPicture* picture) {
    m_picture = picture->id();
    if (m_pictureID != nullptr) {
        m_pictureID->setId(picture->id());
    }

    ui->listWidget->item(0)->setText(picture->toString());
}

void WidgetPicture::initialize(int i) {
    SystemPicture *pic;

    // Graphic update
    m_picture = i;
    pic = this->picture();
    setPicture(pic);

    emit pictureChanged(pic);
}

void WidgetPicture::initializeSuper(SuperListItem *super) {
    m_pictureID = super;
    initialize(m_pictureID->id());
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPicture::openDialog(){
    DialogPicturesPreview dialog(this->picture(), m_kind);
    int previousPictureID = m_picture;
    SystemPicture *pic;

    int result = dialog.exec();
    pic = dialog.picture();
    setPicture(pic);
    if (result == QDialog::Rejected || (result == QDialog::Accepted &&
        previousPictureID != m_picture))
    {
        emit pictureChanged(pic);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetPicture::on_listWidget_itemDoubleClicked(QListWidgetItem*) {
    openDialog();
}

// -------------------------------------------------------

void WidgetPicture::on_pushButton_clicked() {
    openDialog();
}
