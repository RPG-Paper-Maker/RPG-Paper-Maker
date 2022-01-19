/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetvideo.h"
#include "ui_widgetvideo.h"
#include "dialogvideospreview.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetVideo::WidgetVideo(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetVideo),
    m_videoID(nullptr)
{
    ui->setupUi(this);

    QListWidgetItem* item = new QListWidgetItem;
    item->setSizeHint(QSize(item->sizeHint().width(), ui->listWidget->height() -
        4));
    ui->listWidget->addItem(item);
}

WidgetVideo::~WidgetVideo() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetVideo::initialize(SuperListItem *videoID) {
    m_videoID = videoID;

    this->update();
}

// -------------------------------------------------------

void WidgetVideo::update() {
    ui->listWidget->item(0)->setText(reinterpret_cast<SystemVideo *>(
        SuperListItem::getById(RPM::get()->project()->videosDatas()->model()
        ->invisibleRootItem(), m_videoID->id()))->toString());
}

// -------------------------------------------------------

void WidgetVideo::openDialog(){
    DialogVideosPreview dialog(m_videoID);
    int previousID;

    previousID = m_videoID->id();
    if (dialog.exec() == QDialog::Accepted) {
        this->update();

        if (previousID != m_videoID->id()) {
            emit shapeChanged();
        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetVideo::on_listWidget_itemDoubleClicked(QListWidgetItem*) {
    this->openDialog();
}

// -------------------------------------------------------

void WidgetVideo::on_pushButton_clicked() {
    this->openDialog();
}
