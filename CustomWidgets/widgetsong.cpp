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

#include "widgetsong.h"
#include "ui_widgetsong.h"
#include "dialogcommandplaysong.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSong::WidgetSong(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetSong)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(),
                            ui->listWidget->height() - 4));
    ui->listWidget->addItem(item);
}

WidgetSong::~WidgetSong()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSong::initialize(SystemPlaySong *song)
{
    m_song = song;

    update();
}

// -------------------------------------------------------

void WidgetSong::update() {
    ui->listWidget->item(0)->setText(m_song->isSelectedByID() ? "By ID: " +
        m_song->valueID()->toString() : m_song->toString());
}

// -------------------------------------------------------

void WidgetSong::openDialog() {
    DialogCommandPlaySong dialog("Choose a song", m_song);
    if (dialog.exec() == QDialog::Accepted) {
        update();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSong::on_listWidget_itemDoubleClicked(QListWidgetItem*){
    openDialog();
}

// -------------------------------------------------------

void WidgetSong::on_pushButton_clicked(){
    openDialog();
}
