/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

SystemPlaySong * WidgetSong::song() const
{
    return m_song;
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
    ui->listWidget->item(0)->setText(m_song->isSelectedByID() ? RPM::translate(
        Translations::BY_ID) + RPM::COLON + RPM::SPACE + m_song->valueID()
        ->toString() : m_song->toString());
}

// -------------------------------------------------------

void WidgetSong::openDialog() {
    DialogCommandPlaySong dialog(RPM::translate(Translations::CHOOSE_A_SONG),
        m_song);
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
