/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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
#include "wanok.h"
#include "dialogpicturespreview.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPicture::WidgetPicture(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetPicture)
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

SystemPicture* WidgetPicture::picture() const { return m_picture; }

QListWidget* WidgetPicture::list() const { return ui->listWidget; }

void WidgetPicture::setKind(PictureKind kind){
    m_kind = kind;
}

void WidgetPicture::setPicture(SystemPicture* picture) {
    m_picture = picture;

    ui->listWidget->item(0)->setText(m_picture->toString());
}

void WidgetPicture::initialize(int i){
    if (i < 1) i = 1;

    PicturesDatas* datas = Wanok::get()->project()->picturesDatas();

    // Graphic update
    m_picture = (SystemPicture*) SuperListItem::getById(datas->model(m_kind)
                                                        ->invisibleRootItem(),
                                                        i);

    if (m_picture == nullptr){
        m_picture = (SystemPicture*)
                SuperListItem::getById(datas->model(m_kind)
                                       ->invisibleRootItem(), 1);
    }

    setPicture(m_picture);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPicture::openDialog(){
    DialogPicturesPreview dialog(m_picture, m_kind);
    SystemPicture* previousPicture = m_picture;

    int result = dialog.exec();
    setPicture(dialog.picture());
    if (result == QDialog::Accepted && previousPicture != m_picture)
        emit pictureChanged(m_picture);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetPicture::on_listWidget_itemDoubleClicked(QListWidgetItem*){
    openDialog();
}

// -------------------------------------------------------

void WidgetPicture::on_pushButton_clicked(){
    openDialog();
}
