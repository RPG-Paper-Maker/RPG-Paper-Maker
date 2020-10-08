/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemskybox.h"
#include "ui_dialogsystemskybox.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemSkyBox::DialogSystemSkyBox(SystemSkyBox &sb, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemSkyBox),
    m_skyBox(sb)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemSkyBox::~DialogSystemSkyBox()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemSkyBox::initialize()
{
    ui->lineEditName->setText(m_skyBox.name());
    ui->widgetPictureFront->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureFront->initializeSuper(m_skyBox.frontID());
    ui->widgetPictureBack->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureBack->initializeSuper(m_skyBox.backID());
    ui->widgetPictureTop->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureTop->initializeSuper(m_skyBox.topID());
    ui->widgetPictureBottom->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureBottom->initializeSuper(m_skyBox.bottomID());
    ui->widgetPictureLeft->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureLeft->initializeSuper(m_skyBox.leftID());
    ui->widgetPictureRight->setKind(PictureKind::SkyBoxes);
    ui->widgetPictureRight->initializeSuper(m_skyBox.rightID());
}

//-------------------------------------------------

void DialogSystemSkyBox::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_SKY_BOX) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelFront->setText(RPM::translate(Translations::FRONT) + RPM::COLON);
    ui->labelBack->setText(RPM::translate(Translations::BACK) + RPM::COLON);
    ui->labelTop->setText(RPM::translate(Translations::TOP) + RPM::COLON);
    ui->labelBottom->setText(RPM::translate(Translations::BOTTOM) + RPM::COLON);
    ui->labelLeft->setText(RPM::translate(Translations::LEFT) + RPM::COLON);
    ui->labelRight->setText(RPM::translate(Translations::RIGHT) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemSkyBox::on_lineEditName_textChanged(const QString &text)
{
    m_skyBox.setName(text);
}
