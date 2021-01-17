/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "picturesdatas.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PicturesDatas::PicturesDatas() :
    m_missingPicture(new SystemPicture(-2, "picture_not_found", true, "", true))
{

}

PicturesDatas::~PicturesDatas()
{
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++) {
        SuperListItem::deleteModel(i.value());
    }

    delete m_missingPicture;
}

void PicturesDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_PICTURES_DATAS), *this);
}

QStandardItemModel* PicturesDatas::model(PictureKind kind) const {
    return m_models[kind];
}

void PicturesDatas::setModel(PictureKind kind, QStandardItemModel *model) {
    m_models[kind] = model;
}

SystemPicture * PicturesDatas::missingPicture() const {
    return m_missingPicture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PicturesDatas::setDefault() {
    QList<QString> names;

    this->setDefaultBars(names);
    this->setDefaultFacesets(names);
    this->setDefaultIcons(names);
    this->setDefaultAutotiles(names);
    this->setDefaultBattlers(names);
    this->setDefaultCharacters(names);
    this->setDefaultReliefs(names);
    this->setDefaultTilesets(names);
    this->setDefaultWalls(names);
    this->setDefaultWindowSkins(names);
    this->setDefaultTitleScreen(names);
    this->setDefaultObjects3D(names);
    this->setDefaultHUDPictures(names);
    this->setDefaultAnimations(names);
    this->setDefaultSkyBoxes(names);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultBars(QList<QString>& names) {
    names << "hpBar" << "mpBar" << "spBar";
    setDefaultPictures(names, PictureKind::Bars);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultFacesets(QList<QString>& names) {
    names << "lucas" << "kate" << "bibi" << "shana" << "wooly";
    setDefaultPictures(names, PictureKind::Facesets);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultIcons(QList<QString>& names) {
    names << "g" << "xcoin" << "attack" << "skill" << "item" << "escape" <<
        "endTurn" << "blazingSword" << "darkness" << "heal" << "fire" << "water"
        << "wind" << "bandage" << "concentration" << "HPPotion" <<
        "superHPPotion" << "megaHPPotion" << "MPPotion" << "superMPPotion" <<
        "megaMPPotion" << "TPPotion" << "superTPPotion" << "megaTPPotion" <<
        "key" << "woodenSword" << "ironAxe" << "bronzeHelmet" << "bronzeMail" <<
        "bronzeVambraces" << "bronzeGreaves" << "sapphireRing" <<
        "sapphireNecklace" << "grass";
    setDefaultPictures(names, PictureKind::Icons);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultWindowSkins(QList<QString>& names) {
    names << "default";
    setDefaultPictures(names, PictureKind::WindowSkins);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultTitleScreen(QList<QString>& names) {
    names << "background";
    setDefaultPictures(names, PictureKind::TitleScreen);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultHUDPictures(QList<QString>& names) {
    setDefaultPictures(names, PictureKind::Pictures);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultAutotiles(QList<QString>& names) {
    names << "general";
    setDefaultPictures(names, PictureKind::Autotiles);
    reinterpret_cast<SystemPicture *>(m_models[PictureKind::Autotiles]->item(1)
        ->data().value<quintptr>())->setDefaultAutotiles();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultBattlers(QList<QString>& names) {
    names << "lucas" << "kate" << "bibi" << "shana" << "wooly";
    setDefaultPictures(names, PictureKind::Battlers);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultCharacters(QList<QString>& names) {
    SystemPicture *picture;

    names << "lucas";
    setDefaultPictures(names, PictureKind::Characters);
    picture = reinterpret_cast<SystemPicture *>(m_models[PictureKind::Characters]
        ->item(1)->data().value<quintptr>());
    picture->setDefaultLucas();

    // Insert tileset
    picture = new SystemPicture;
    picture->setKind(PictureKind::Characters);
    picture->setDefaultCharacterTileset();
    m_models[PictureKind::Characters]->insertRow(1, picture->getModelRow());
}

// -------------------------------------------------------

void PicturesDatas::setDefaultReliefs(QList<QString>& names) {
    names << "grass";
    setDefaultPictures(names, PictureKind::Mountains);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultTilesets(QList<QString>& names) {
    names << "plains";
    setDefaultPictures(names, PictureKind::Tilesets);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Tilesets]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultTilesetPlains();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultWalls(QList<QString>& names) {
    names << "inside1";
    setDefaultPictures(names, PictureKind::Walls);
    SystemPicture* picture = (SystemPicture*) m_models[PictureKind::Walls]
            ->item(1)->data().value<quintptr>();
    picture->setDefaultWallInside();
}

// -------------------------------------------------------

void PicturesDatas::setDefaultObjects3D(QList<QString> &names) {
    names << "chest" << "cupboard" << "fridge" << "table" << "bottom-chair" <<
        "chair-back" << "big-log" << "small-log" << "tiny-log" <<
        "cobblestone-cube" << "dresser" << "giant-wood-building" <<
        "wood-deck" << "brick-building" << "bed" << "dining-table" << "cabinets1" <<
        "cabinets2" << "macrowave" << "shop-stand1" << "shop-stand2" <<
        "big-brick-building" << "green-building-with-door" << "green-building"
        << "wood-building" << "big-bed" << "small-bookshelf" << "bookshelf" <<
        "small-television" << "television" << "bench-stone" << "bench-wood" <<
        "picnic-table-stone" << "picnic-table-wood" << "minecart" <<
        "fancy-house" << "small-wood-post" << "roof-texture" << "brick-chimney"
        << "tent";
    this->setDefaultPictures(names, PictureKind::Object3D);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultAnimations(QList<QString>& names) {
    names << "basic";
    this->setDefaultPictures(names, PictureKind::Animations);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultSkyBoxes(QList<QString>& names)
{
    names << "clouds-front" << "clouds-back"<< "clouds-top" << "clouds-bottom"
        << "clouds-left" << "clouds-right";
    this->setDefaultPictures(names, PictureKind::SkyBoxes);
}

// -------------------------------------------------------

void PicturesDatas::fillList(QList<SystemPicture*> &pictures,
                             QList<QString>& names, PictureKind kind)
{
    int i;

    pictures << new SystemPicture;
    pictures.at(0)->setKind(kind);
    for (i = 0; i < names.size() ; i++)
    {
        pictures << new SystemPicture(i + 1, names.at(i) + ".png", true, "",
            false, kind);
    }
}

// -------------------------------------------------------

void PicturesDatas::setDefaultPictures(QList<QString> &names,
                                       PictureKind kind)
{
    QList<SystemPicture*> pictures;
    fillList(pictures, names, kind);

    QStandardItemModel* model = new QStandardItemModel;
    QList<QStandardItem*> row;

    for (int i = 0; i < pictures.size(); i++){
        row = pictures.at(i)->getModelRow();
        model->appendRow(row);
    }
    m_models[kind] = model;

    names.clear();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void PicturesDatas::read(const QJsonObject &json){
    QJsonArray jsonList = json["list"].toArray();
    QJsonObject jsonObj;
    QJsonArray jsonArray;
    QStandardItemModel* model;
    QList<QStandardItem*> row;
    PictureKind k;

    // Clear
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());

    // Read
    for (int i = 0; i < jsonList.size(); i++)
    {
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj["v"].toArray();
        model = new QStandardItemModel;
        k = static_cast<PictureKind>(jsonObj["k"].toInt());
        for (int j = 0; j < jsonArray.size(); j++)
        {
            SystemPicture* super = new SystemPicture;
            super->read(jsonArray[j].toObject());
            super->setKind(k);
            row = super->getModelRow();
            model->appendRow(row);
        }

        m_models[k] = model;
    }
}

// -------------------------------------------------------

void PicturesDatas::write(QJsonObject &json) const{
    QJsonArray jsonFinalArray;
    QStandardItemModel* model;

    QHash<PictureKind, QStandardItemModel*>::const_iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++){
        model = i.value();
        QJsonObject jsonObj;
        QJsonArray jsonArray;
        jsonObj["k"] = (int) i.key();
        for (int j = 0; j < model->invisibleRootItem()->rowCount(); j++){
            QJsonObject jsonObjPicture;

            SystemPicture* super = ((SystemPicture*) model->item(j)->data()
                                    .value<quintptr>());
            super->write(jsonObjPicture);
            jsonArray.append(jsonObjPicture);
        }
        jsonObj["v"] = jsonArray;
        jsonFinalArray.append(jsonObj);
    }

    json["list"] = jsonFinalArray;
}
