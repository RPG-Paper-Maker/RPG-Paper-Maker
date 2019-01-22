/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "paneldatascharacter.h"
#include "ui_paneldatascharacter.h"
#include "systemhero.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasCharacter::PanelDatasCharacter(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasCharacter),
    m_panelSuperList(nullptr)
{
    ui->setupUi(this);

    initialize();
}

PanelDatasCharacter::~PanelDatasCharacter()
{
    delete ui;
}

void PanelDatasCharacter::setPanelSuperList(PanelSuperList *list) {
    m_panelSuperList = list;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasCharacter::initialize() {

    // Class
    SuperListItem::fillComboBox(ui->comboBoxClass, RPM::get()->project()
        ->gameDatas()->classesDatas()->model());

    // Battler
    ui->widgetPictureBattler->setKind(PictureKind::Battlers);
    connect(ui->widgetPictureBattler, SIGNAL(pictureChanged(SystemPicture *)),
        this, SLOT(on_battlerPictureChanged(SystemPicture *)));

    // Faceset
    ui->widgetImageFaceset->setActivateCoef(false);
    ui->widgetImageFaceset->setCoef(0.5f);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    connect(ui->widgetPictureFaceset, SIGNAL(pictureChanged(SystemPicture *)),
        this, SLOT(on_facesetPictureChanged(SystemPicture *)));
}

// -------------------------------------------------------

void PanelDatasCharacter::update(SystemHero *hero, int classIndex) {
    SystemPicture *picture;
    ui->comboBoxClass->setCurrentIndex(classIndex);
    picture = hero->getPictureBattler();
    ui->widgetPictureBattler->setPicture(picture);
    on_battlerPictureChanged(picture);
    picture = hero->getPictureFaceset();
    ui->widgetPictureFaceset->setPicture(picture);
    on_facesetPictureChanged(picture);
}

// -------------------------------------------------------

SystemHero * PanelDatasCharacter::currentHero() {
    return reinterpret_cast<SystemHero *>(m_panelSuperList->list()
        ->getSelected()->data().value<quintptr>());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasCharacter::on_comboBoxClass_currentIndexChanged(int index) {
    if (m_panelSuperList != nullptr) {
        currentHero()->setIdClass(SuperListItem::getIdByIndex(RPM::get()
            ->project()->gameDatas()->classesDatas()->model(), index));
    }
}

// -------------------------------------------------------

void PanelDatasCharacter::on_battlerPictureChanged(SystemPicture *picture) {
    currentHero()->setIdBattlerPicture(picture->id());
    ui->widgetImageBattler->updatePicture(picture, PictureKind::Battlers);
}


// -------------------------------------------------------

void PanelDatasCharacter::on_facesetPictureChanged(SystemPicture *picture) {
    currentHero()->setIdFacesetPicture(picture->id());
    ui->widgetImageFaceset->updatePicture(picture, PictureKind::Facesets);
}
