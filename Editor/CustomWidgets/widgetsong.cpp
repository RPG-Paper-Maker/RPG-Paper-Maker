/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
