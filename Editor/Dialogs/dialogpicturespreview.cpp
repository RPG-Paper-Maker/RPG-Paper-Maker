/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    PictureKind kind, PrimitiveValue *valueID, QStandardItemModel *properties,
    QStandardItemModel *parameters, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogPicturesPreview),
    m_kind(kind),
    m_initialPictureID(picture->id()),
    m_idValue(valueID),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);

    ui->widget->setChooseRect(true);
    ui->widget->setPictureKind(kind);
    ui->widget->changePicture(picture);
    ui->widget->showAvailableContent(RPM::get()->engineSettings()
        ->showAvailableContent());

    if (m_idValue == nullptr)
    {
        ui->checkBoxPictureID->hide();
        ui->panelPrimitiveValuePictureID->hide();
    } else
    {
        ui->checkBoxPictureID->setChecked(m_idValue->isActivated());
        m_idValue->setModelParameter(m_parameters);
        m_idValue->setModelProperties(m_properties);
        ui->panelPrimitiveValuePictureID->initializeNumberAndUpdate(m_idValue);
    }

    connect(this, SIGNAL(accepted()), this, SLOT(on_accepted()));
    connect(this, SIGNAL(rejected()), this, SLOT(on_rejected()));
    connect(this, SIGNAL(dialogIsClosing()), this, SLOT(on_rejected()));

    this->translate();
}

DialogPicturesPreview::~DialogPicturesPreview()
{
    delete ui;
}

SystemPicture * DialogPicturesPreview::picture() const
{
    return ui->widget->picture();
}

PrimitiveValue * DialogPicturesPreview::idValue() const
{
    return m_idValue;
}

bool DialogPicturesPreview::isIDValue() const
{
    return ui->checkBoxPictureID->isChecked();
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

//-------------------------------------------------

void DialogPicturesPreview::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SELECT_PICTURE) + RPM
        ::DOT_DOT_DOT);
    ui->checkBoxPictureID->setText(RPM::translate(Translations
        ::SELECT_PICTURE_ID) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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

// -------------------------------------------------------

void DialogPicturesPreview::on_checkBoxPictureID_toggled(bool checked)
{
    m_idValue->setIsActivated(checked);
    ui->panelPrimitiveValuePictureID->setEnabled(checked);
}
