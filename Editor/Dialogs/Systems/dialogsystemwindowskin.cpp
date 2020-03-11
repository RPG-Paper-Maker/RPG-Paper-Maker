/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
#include "dialogsystemwindowskin.h"
#include "ui_dialogsystemwindowskin.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemWindowSkin::DialogSystemWindowSkin(SystemWindowSkin& windowSkin,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemWindowSkin),
    m_windowSkin(windowSkin)
{
    ui->setupUi(this);

    initialize();

    this->translate();
}

DialogSystemWindowSkin::~DialogSystemWindowSkin()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::initialize() {
    SystemPicture *picture = reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::WindowSkins)->invisibleRootItem(), m_windowSkin.pictureID()));

    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetPicture->setKind(PictureKind::WindowSkins);
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)), this,
        SLOT(on_pictureChanged(SystemPicture *)));
    ui->widgetPicture->setPicture(picture);
    on_pictureChanged(picture);
    updateZoom(RPM::get()->engineSettings()->zoomPictures());
    connect(ui->widgetShowPicture, SIGNAL(rectDrawn()), this, SLOT(
        on_rectDrawn()));
    ui->comboBoxOptionBackground->setCurrentIndex(m_windowSkin.backgroudRepeat()
        ? 1 : 0);

    // Rect selectors
    ui->widgetSelectRectTopLeft->updateLabel("Top-Left");
    ui->widgetSelectRectTopLeft->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTopLeft->setRect(m_windowSkin.topLeft());
    connect(ui->widgetSelectRectTopLeft, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTopRight->updateLabel("Top-Right");
    ui->widgetSelectRectTopRight->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTopRight->setRect(m_windowSkin.topRight());
    connect(ui->widgetSelectRectTopRight, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectBotLeft->updateLabel("Bot-Left");
    ui->widgetSelectRectBotLeft->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectBotLeft->setRect(m_windowSkin.botLeft());
    connect(ui->widgetSelectRectBotLeft, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectBotRight->updateLabel("Bot-Right");
    ui->widgetSelectRectBotRight->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectBotRight->setRect(m_windowSkin.botRight());
    connect(ui->widgetSelectRectBotRight, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectLeft->updateLabel("Left");
    ui->widgetSelectRectLeft->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectLeft->setRect(m_windowSkin.left());
    connect(ui->widgetSelectRectLeft, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectRight->updateLabel("Right");
    ui->widgetSelectRectRight->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectRight->setRect(m_windowSkin.right());
    connect(ui->widgetSelectRectRight, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTop->updateLabel("Top");
    ui->widgetSelectRectTop->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTop->setRect(m_windowSkin.top());
    connect(ui->widgetSelectRectTop, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectBot->updateLabel("Bot");
    ui->widgetSelectRectBot->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectBot->setRect(m_windowSkin.bot());
    connect(ui->widgetSelectRectBot, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectBackground->updateLabel("Normal");
    ui->widgetSelectRectBackground->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectBackground->setRect(m_windowSkin.background());
    connect(ui->widgetSelectRectBackground, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectBackgroundSelection->updateLabel("Selection");
    ui->widgetSelectRectBackgroundSelection->setWidgetShowPicture(ui
        ->widgetShowPicture);
    ui->widgetSelectRectBackgroundSelection->setRect(m_windowSkin
        .backgroundSelection());
    connect(ui->widgetSelectRectBackgroundSelection, SIGNAL(selecting()), this,
        SLOT(on_selecting()));
    ui->widgetSelectRectArrowEndMessage->updateLabel("End message");
    ui->widgetSelectRectArrowEndMessage->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectArrowEndMessage->setRect(m_windowSkin.arrowEndMessage());
    connect(ui->widgetSelectRectArrowEndMessage, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectArrowTargetSelection->updateLabel("Target selection");
    ui->widgetSelectRectArrowTargetSelection->setWidgetShowPicture(ui->
        widgetShowPicture);
    ui->widgetSelectRectArrowTargetSelection->setRect(m_windowSkin
        .arrowTargetSelection());
    connect(ui->widgetSelectRectArrowTargetSelection, SIGNAL(selecting()), this,
        SLOT(on_selecting()));
    ui->widgetSelectRectArrowUpDown->updateLabel("Up / Down");
    ui->widgetSelectRectArrowUpDown->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectArrowUpDown->setRect(m_windowSkin.arrowUpDown());
    connect(ui->widgetSelectRectArrowUpDown, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTextNormal->updateLabel("Normal damage");
    ui->widgetSelectRectTextNormal->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTextNormal->setRect(m_windowSkin.textNormal());
    connect(ui->widgetSelectRectTextNormal, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTextCritical->updateLabel("Critical damage");
    ui->widgetSelectRectTextCritical->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTextCritical->setRect(m_windowSkin.textCritical());
    connect(ui->widgetSelectRectTextCritical, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTextHeal->updateLabel("Heal damage");
    ui->widgetSelectRectTextHeal->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTextHeal->setRect(m_windowSkin.textHeal());
    connect(ui->widgetSelectRectTextHeal, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
    ui->widgetSelectRectTextMiss->updateLabel("Miss");
    ui->widgetSelectRectTextMiss->setWidgetShowPicture(ui->widgetShowPicture);
    ui->widgetSelectRectTextMiss->setRect(m_windowSkin.textMiss());
    connect(ui->widgetSelectRectTextMiss, SIGNAL(selecting()), this, SLOT(
        on_selecting()));
}

// -------------------------------------------------------

void DialogSystemWindowSkin::updateZoom(int zoom) {
    m_zoom = 1.0;
    if (zoom > 0)
        m_zoom *= (zoom + 1);
    else if (zoom < 0)
        m_zoom /= ((-zoom) + 1);
    ui->horizontalSlider->setValue(zoom);
    ui->widgetShowPicture->setCoef(m_zoom);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::enableAll(bool b) {
    ui->label->setEnabled(b);
    ui->widgetPicture->setEnabled(b);
    ui->groupBoxSideBorders->setEnabled(b);
    ui->groupBoxBorders->setEnabled(b);
    ui->groupBoxBackground->setEnabled(b);
    ui->groupBoxArrows->setEnabled(b);
    ui->groupBoxTexts->setEnabled(b);
}

//-------------------------------------------------

void DialogSystemWindowSkin::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::closeEvent(QCloseEvent *event) {
    ui->widgetShowPicture->updateToRectBefore();
    QDialog::closeEvent(event);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemWindowSkin::on_pictureChanged(SystemPicture *picture) {
    m_windowSkin.setPictureID(picture->id());
    ui->widgetShowPicture->updatePicture(picture, PictureKind::WindowSkins);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::on_horizontalSlider_valueChanged(int value) {
    updateZoom(value);

    // Update in the settings
    RPM::get()->engineSettings()->setZoomPictures(value);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::on_comboBoxOptionBackground_currentIndexChanged(int
    index)
{
    m_windowSkin.setBackgroundRepeat(index == 1);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::on_selecting() {
    enableAll(false);
}

// -------------------------------------------------------

void DialogSystemWindowSkin::on_rectDrawn() {
    enableAll(true);
}
