/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
    m_pictureIndexX(0),
    m_indexXID(nullptr),
    m_pictureIndexY(0),
    m_indexYID(nullptr),
    m_isLimitIndex(true),
    m_valueID(nullptr),
    m_properties(nullptr),
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

int WidgetPicture::pictureIndexX() const
{
    return m_pictureIndexX;
}

void WidgetPicture::setPictureIndexX(int pictureIndexX)
{
    m_pictureIndexX = pictureIndexX;
}

int WidgetPicture::pictureIndexY() const
{
    return m_pictureIndexY;
}

void WidgetPicture::setPictureIndexY(int pictureIndexY)
{
    m_pictureIndexY = pictureIndexY;
}

void WidgetPicture::setIsLimitIndex(bool isLimitIndex)
{
    m_isLimitIndex = isLimitIndex;
}

void WidgetPicture::initialize(int i, int indexX, int indexY) {
    SystemPicture *pic;

    // Graphic update
    m_picture = i;
    m_pictureIndexX = indexX;
    m_pictureIndexY = indexY;
    pic = this->picture();
    setPicture(pic);

    emit pictureChanged(pic);
}

void WidgetPicture::initializeSuper(SuperListItem *super, SuperListItem *indexX,
    SuperListItem *indexY)
{
    m_pictureID = super;
    m_indexXID = indexX;
    m_indexYID = indexY;
    initialize(m_pictureID->id(), indexX == nullptr ? 0 : indexX->id(), indexY
        == nullptr ? 0 : indexY->id());
}

void WidgetPicture::initializePrimitive(PrimitiveValue *value,
    QStandardItemModel *properties, QStandardItemModel *parameters)
{
    m_valueID = value;
    m_properties = properties;
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
    DialogPicturesPreview dialog(this->picture(), m_kind, m_valueID, m_properties,
        m_parameters, m_pictureIndexX, m_pictureIndexY, m_isLimitIndex);
    int previousPictureID = m_picture;
    int previousIndexX = m_pictureIndexX;
    int previousIndexY = m_pictureIndexY;
    SystemPicture *pic;

    if (dialog.exec() == QDialog::Accepted)
    {
        m_pictureIndexX = dialog.indexX();
        m_pictureIndexY = dialog.indexY();
    }
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
    if (m_indexXID != nullptr)
    {
        m_indexXID->setId(m_pictureIndexX);
    }
    if (m_indexYID != nullptr)
    {
        m_indexYID->setId(m_pictureIndexY);
    }
    if (previousPictureID != m_picture) {
        emit pictureChanged(pic);
    }
    if (previousIndexX != m_pictureIndexX || previousIndexY != m_pictureIndexY)
    {
        emit indexChanged(m_pictureIndexX, m_pictureIndexY);
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
