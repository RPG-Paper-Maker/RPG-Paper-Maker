/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    m_pictureID(nullptr),
    m_valueID(nullptr),
    m_object(nullptr),
    m_parameters(nullptr)
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
    ui->listWidget->item(0)->setText(m_valueID == nullptr || m_valueID->kind()
        == PrimitiveValueKind::Number ? picture->toString() : m_valueID
        ->toString());
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

void WidgetPicture::initializePrimitive(PrimitiveValue *value,
    SystemCommonObject *object, QStandardItemModel *parameters)
{
    m_valueID = value;
    m_object = object;
    m_parameters = parameters;
    if (m_valueID->kind() == PrimitiveValueKind::Number)
    {
        this->initialize(m_valueID->numberValue());
    } else
    {
        this->initialize(-1);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPicture::openDialog(){
    DialogPicturesPreview dialog(this->picture(), m_kind, m_valueID, m_object,
        m_parameters);
    int previousPictureID = m_picture;
    SystemPicture *pic;

    dialog.exec();
    if (m_valueID != nullptr)
    {
        if (m_valueID->isActivated())
        {
            pic = reinterpret_cast<SystemPicture *>(RPM::get()->project()
                ->picturesDatas()->model(m_kind)->item(0)->data().value<quintptr>());
        } else
        {
            pic = dialog.picture();
            m_valueID->setKind(PrimitiveValueKind::Number);
            m_valueID->setNumberValue(pic->id());
        }
    } else
    {
        pic = dialog.picture();
    }
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
