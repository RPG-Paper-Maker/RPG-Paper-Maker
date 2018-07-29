/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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
#include "wanok.h"

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

EventCommand* WidgetSong::command() const {
    return m_command;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSong::initialize(EventCommand* command, SongKind kind,
    SystemCommonObject* object, QStandardItemModel* parameters)
{
    m_command = command;
    m_kind = kind;
    m_object = object;
    m_parameters = parameters;

    update();
}

// -------------------------------------------------------

void WidgetSong::update() {
    if (m_command == nullptr) {
        ui->listWidget->item(0)->setText("<None>");
    }
    else {
        ui->listWidget->item(0)->setText(SuperListItem::getById(Wanok::get()
            ->project()->songsDatas()->model(m_kind)->invisibleRootItem(),
            m_command->getSongID(m_parameters))->toString());
    }
    emit updated();
}

// -------------------------------------------------------

void WidgetSong::openDialog(){
    DialogCommandPlaySong dialog("Choose a song", m_kind, m_command, m_object,
        m_parameters, this);
    if (dialog.exec() == QDialog::Accepted) {
        if (m_command != nullptr) {
            delete m_command;
        }
        m_command = dialog.getCommand();
        if (m_command->getSongID(m_parameters) == -1) {
            delete m_command;
            m_command = nullptr;
        }
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
