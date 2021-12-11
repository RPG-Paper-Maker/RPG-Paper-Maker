/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    this->translate();
}

PanelDatasCharacter::~PanelDatasCharacter()
{
    delete ui;
}

void PanelDatasCharacter::setPanelSuperList(PanelSuperList *list) {
    m_panelSuperList = list;
}

PanelDatasClass * PanelDatasCharacter::panelDatasClass() const {
    return ui->panelDatasClass;
}

int PanelDatasCharacter::finalLevel() const {
    return panelDatasClass()->finalLevel();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasCharacter::initialize() {

    // Class
    updateClasses();

    // Battler
    ui->widgetPictureBattler->setKind(PictureKind::Battlers);
    connect(ui->widgetPictureBattler, SIGNAL(pictureChanged(SystemPicture *)),
        this, SLOT(on_battlerPictureChanged(SystemPicture *)));

    // Faceset
    ui->widgetImageFaceset->setActivateCoef(false);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->setIsLimitIndex(false);
    connect(ui->widgetPictureFaceset, SIGNAL(pictureChanged(SystemPicture *)),
        this, SLOT(on_facesetPictureChanged(SystemPicture *)));
    connect(ui->widgetPictureFaceset, SIGNAL(indexChanged(int, int)), this, SLOT(
        on_facesetIndexChanged(int, int)));

    // Class
    ui->panelDatasClass->initialize(false);
}

// -------------------------------------------------------

void PanelDatasCharacter::update(SystemHero *hero, int classIndex) {
    SystemPicture *picture;
    ui->comboBoxClass->setCurrentIndex(classIndex);
    picture = hero->getPictureBattler();
    ui->widgetPictureBattler->setPicture(picture);
    on_battlerPictureChanged(picture);
    picture = hero->getPictureFaceset();
    ui->widgetPictureFaceset->initialize(picture->id(), hero->indexXFacesetPicture(),
        hero->indexYFacesetPicture());
    ui->widgetPictureFaceset->setPicture(picture);
    on_facesetPictureChanged(picture);
    ui->widgetTextLangDescription->initializeNamesLang(hero->description());
    this->updateFacesetIndex();

    // Class
    updateClass();
}

// -------------------------------------------------------

SystemHero * PanelDatasCharacter::currentHero() {
    return reinterpret_cast<SystemHero *>(m_panelSuperList->list()
        ->getSelected()->data().value<quintptr>());
}

// -------------------------------------------------------

void PanelDatasCharacter::updateClasses() {
    int index = ui->comboBoxClass->currentIndex();
    ui->comboBoxClass->clear();
    SuperListItem::fillComboBox(ui->comboBoxClass, RPM::get()->project()
        ->gameDatas()->classesDatas()->model());
    ui->comboBoxClass->setCurrentIndex(index);
}

// -------------------------------------------------------

void PanelDatasCharacter::updateClass() {
    SystemHero *hero = currentHero();
    ui->panelDatasClass->update(hero->classInherit(), hero->getClass());
}

// -------------------------------------------------------

void PanelDatasCharacter::updateFacesetIndex()
{
    ui->widgetImageFaceset->setRectSubImage(QRectF(ui->widgetPictureFaceset
        ->pictureIndexX() * RPM::get()->project()->gameDatas()->systemDatas()
        ->facesetsSize(), ui->widgetPictureFaceset->pictureIndexY() * RPM::get()
        ->project()->gameDatas()->systemDatas()->facesetsSize(), RPM::get()
        ->project()->gameDatas()->systemDatas()->facesetsSize(), RPM::get()
        ->project()->gameDatas()->systemDatas()->facesetsSize()));
}

//-------------------------------------------------

void PanelDatasCharacter::translate()
{
    ui->labelClass->setText(RPM::translate(Translations::CLASS) + RPM::COLON);
    ui->groupBoxFaceset->setTitle(RPM::translate(Translations::FACESET));
    ui->groupBoxBattler->setTitle(RPM::translate(Translations::BATTLER));
    ui->labelDescription->setText(RPM::translate(Translations::DESCRIPTION) + RPM::COLON);
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
        updateClass();
    }
}

// -------------------------------------------------------

void PanelDatasCharacter::on_battlerPictureChanged(SystemPicture *picture) {
    currentHero()->setIdBattlerPicture(picture->id());
    ui->widgetImageBattler->updatePicture(picture);
}


// -------------------------------------------------------

void PanelDatasCharacter::on_facesetPictureChanged(SystemPicture *picture) {
    currentHero()->setIdFacesetPicture(picture->id());
    ui->widgetImageFaceset->updatePicture(picture);
}

// -------------------------------------------------------

void PanelDatasCharacter::on_facesetIndexChanged(int x, int y)
{
    currentHero()->setIndexXFacesetPicture(x);
    currentHero()->setIndexYFacesetPicture(y);
    this->updateFacesetIndex();
}
