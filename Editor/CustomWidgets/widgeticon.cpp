/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgeticon.h"
#include "ui_widgeticon.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetIcon::WidgetIcon(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetIcon)
{
    ui->setupUi(this);

    this->translate();
}

WidgetIcon::~WidgetIcon()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetIcon::initializeIcon(SystemIcon *icon) {
    m_icon = icon;
    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)),
            this, SLOT(on_pictureChanged(SystemPicture *)));
    connect(ui->widgetPicture, SIGNAL(indexChanged(int, int)), this, SLOT(
        on_indexChanged(int, int)));
    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetPicture->setKind(PictureKind::Icons);
    ui->widgetPicture->setIsLimitIndex(false);
    ui->widgetPicture->initialize(m_icon->pictureID(), m_icon->pictureIndexX(),
        m_icon->pictureIndexY());
}

//-------------------------------------------------

void WidgetIcon::update()
{
    ui->widgetShowPicture->updatePicture(ui->widgetPicture->picture());
    m_icon->setPictureID(ui->widgetPicture->picture()->id());
    m_icon->setPictureIndexX(ui->widgetPicture->pictureIndexX());
    m_icon->setPictureIndexY(ui->widgetPicture->pictureIndexY());
    ui->widgetShowPicture->setRectSubImage(QRectF(ui->widgetPicture->pictureIndexX() *
        RPM::get()->project()->gameDatas()->systemDatas()->iconsSize(), ui
        ->widgetPicture->pictureIndexY() * RPM::get()->project()->gameDatas()
        ->systemDatas()->iconsSize(), RPM::get()->project()->gameDatas()
        ->systemDatas()->iconsSize(), RPM::get()->project()->gameDatas()
        ->systemDatas()->iconsSize()));
}

//-------------------------------------------------

void WidgetIcon::translate()
{
    ui->labelIcon->setText(RPM::translate(Translations::ICON) + RPM::COLON);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetIcon::on_pictureChanged(SystemPicture *)
{
    this->update();
}

// -------------------------------------------------------

void WidgetIcon::on_indexChanged(int, int)
{
    this->update();
}
