/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogvideospreview.h"
#include "ui_dialogvideospreview.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogVideosPreview::DialogVideosPreview(SuperListItem *videoID, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogVideosPreview),
    m_videoID(videoID),
    m_initialVideoID(videoID->id())
{
    ui->setupUi(this);

    ui->widget->setKind();
    ui->widget->changeVideo(videoID);
    ui->widget->showAvailableContent(false);

    connect(this, SIGNAL(accepted()), this, SLOT(on_accepted()));
    connect(this, SIGNAL(rejected()), this, SLOT(on_rejected()));
}

DialogVideosPreview::~DialogVideosPreview()
{
    delete ui;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogVideosPreview::closeEvent(QCloseEvent *) {
    this->on_rejected();
}

// -------------------------------------------------------

void DialogVideosPreview::on_accepted() {
    RPM::get()->project()->writeVideosDatas();
}

// -------------------------------------------------------

void DialogVideosPreview::on_rejected() {
    RPM::get()->project()->readVideosDatas();

    // Update new video adress
    SuperListItem *super = SuperListItem::getById(RPM::get()->project()
        ->videosDatas()->model()->invisibleRootItem(), m_initialVideoID);
    m_videoID->setId(super->id());
    m_videoID->setName(super->name());
}
