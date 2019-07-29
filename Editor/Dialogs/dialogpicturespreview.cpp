/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogpicturespreview.h"
#include "ui_dialogpicturespreview.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogPicturesPreview::DialogPicturesPreview(SystemPicture* picture,
                                             PictureKind kind,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPicturesPreview),
    m_kind(kind),
    m_initialPictureID(picture->id())
{
    ui->setupUi(this);

    ui->widget->setChooseRect(true);
    ui->widget->setPictureKind(kind);
    ui->widget->changePicture(picture);
    ui->widget->showAvailableContent(false);

    connect(this, SIGNAL(accepted()), this, SLOT(on_accepted()));
    connect(this, SIGNAL(rejected()), this, SLOT(on_rejected()));
    connect(this, SIGNAL(dialogIsClosing()), this, SLOT(on_rejected()));
}

DialogPicturesPreview::~DialogPicturesPreview()
{
    delete ui;
}

SystemPicture* DialogPicturesPreview::picture() const {
    return ui->widget->picture();
}

int DialogPicturesPreview::indexX() const {
    return ui->widget->indexX();
}

void DialogPicturesPreview::setIndexX(int i) {
    ui->widget->setIndexX(i);
}

int DialogPicturesPreview::indexY() const {
    return ui->widget->indexY();
}

void DialogPicturesPreview::setIndexY(int i) {
    ui->widget->setIndexY(i);
}

void DialogPicturesPreview::setCurrentTexture(QRect rect) {
    ui->widget->setCurrentTexture(rect);
}

void DialogPicturesPreview::currentTexture(QRect& rect) const{
    ui->widget->currentTexture(rect);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogPicturesPreview::setAreNegIDsEnabled(bool b) {
    ui->widget->setAreNegIDsEnabled(b);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogPicturesPreview::closeEvent(QCloseEvent *){
    emit dialogIsClosing();
}

// -------------------------------------------------------

void DialogPicturesPreview::on_accepted(){
    RPM::get()->project()->writePicturesDatas();
}

// -------------------------------------------------------

void DialogPicturesPreview::on_rejected(){
    RPM::get()->project()->readPicturesDatas();

    // Update new picture adress
    ui->widget->setPicture(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(m_kind)
        ->invisibleRootItem(), m_initialPictureID)));
}
