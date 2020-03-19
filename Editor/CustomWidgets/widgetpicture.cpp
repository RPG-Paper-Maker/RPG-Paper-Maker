/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    dialog.exec();
    pic = dialog.picture();
    setPicture(pic);
    if (previousPictureID != m_picture) {
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
