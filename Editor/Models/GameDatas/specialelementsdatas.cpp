/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "specialelementsdatas.h"
#include "systemspritewall.h"
#include "systemautotile.h"
#include "systemobject3d.h"
#include "systemmountain.h"
#include "rpm.h"
#include "common.h"

const QString SpecialElementsDatas::JSON_WALLS = "walls";
const QString SpecialElementsDatas::JSON_AUTOTILES = "autotiles";
const QString SpecialElementsDatas::JSON_OBJECTS_3D = "o";
const QString SpecialElementsDatas::JSON_MOUNTAINS = "m";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpecialElementsDatas::SpecialElementsDatas() :
    m_modelAutotiles(new QStandardItemModel),
    m_modelSpriteWalls(new QStandardItemModel),
    m_modelObjects3D(new QStandardItemModel),
    m_modelMountains(new QStandardItemModel),
    m_missingObject3D(nullptr)
{

}

SpecialElementsDatas::~SpecialElementsDatas()
{
    SuperListItem::deleteModel(m_modelAutotiles);
    SuperListItem::deleteModel(m_modelSpriteWalls);
    SuperListItem::deleteModel(m_modelObjects3D);
    SuperListItem::deleteModel(m_modelMountains);
    if (m_missingObject3D != nullptr) {
        delete m_missingObject3D;
    }
}

void SpecialElementsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SPECIAL_ELEMENTS), *this);
}

QStandardItemModel* SpecialElementsDatas::model(PictureKind kind) const {
    switch (kind) {
    case PictureKind::Autotiles:
        return modelAutotiles();
    case PictureKind::Walls:
        return modelSpriteWalls();
    case PictureKind::Mountains:
        return modelMountains();
    case PictureKind::Object3D:
        return modelObjects3D();
    default:
        return nullptr;
    }
}

QStandardItemModel* SpecialElementsDatas::modelAutotiles() const {
    return m_modelAutotiles;
}

QStandardItemModel* SpecialElementsDatas::modelSpriteWalls() const {
    return m_modelSpriteWalls;
}

QStandardItemModel* SpecialElementsDatas::modelObjects3D() const {
    return m_modelObjects3D;
}

QStandardItemModel* SpecialElementsDatas::modelMountains() const {
    return m_modelMountains;
}

SystemObject3D * SpecialElementsDatas::missingObject3D() const {
    return m_missingObject3D;
}

void SpecialElementsDatas::setDefaultTranslations()
{
    SuperListItem::setModelItemName(m_modelAutotiles, 0, RPM::translate(Translations::GENERAL));
    SuperListItem::setModelItemName(m_modelAutotiles, 1, RPM::translate(Translations::WATER));
    SuperListItem::setModelItemName(m_modelAutotiles, 2, RPM::translate(Translations::HAUNTED));
    SuperListItem::setModelItemName(m_modelAutotiles, 3, RPM::translate(Translations::SNOW));
    SuperListItem::setModelItemName(m_modelAutotiles, 4, RPM::translate(Translations::LAVA));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 0, RPM::translate(Translations::WOODS_WALL));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 1, RPM::translate(Translations::BUSH));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 2, RPM::translate(Translations::BUSH_HAUNTED));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 3, RPM::translate(Translations::BUSH_SNOW));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 4, RPM::translate(Translations::BRIDGE_STRING));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 5, RPM::translate(Translations::BRICK));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 6, RPM::translate(Translations::HEDGE));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 7, RPM::translate(Translations::SANDSTONE));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 8, RPM::translate(Translations::BIG_SANDSTONE));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 9, RPM::translate(Translations::HEDGE_SNOW));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 10, RPM::translate(Translations::INSIDE_DOOR_OPENED));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 11, RPM::translate(Translations::INSIDE_1));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 12, RPM::translate(Translations::INSIDE_2));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 13, RPM::translate(Translations::INSIDE_3));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 14, RPM::translate(Translations::WOOD));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 15, RPM::translate(Translations::SEWERS));
    SuperListItem::setModelItemName(m_modelSpriteWalls, 16, RPM::translate(Translations::CAVE));
    SuperListItem::setModelItemName(m_modelObjects3D, 0, RPM::translate(Translations::TENT));
    SuperListItem::setModelItemName(m_modelObjects3D, 1, RPM::translate(Translations::SMALL_CHEST));
    SuperListItem::setModelItemName(m_modelObjects3D, 2, RPM::translate(Translations::SMALL_CHEST_OPENED));
    SuperListItem::setModelItemName(m_modelObjects3D, 3, RPM::translate(Translations::SMALL_CHEST_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 4, RPM::translate(Translations::SMALL_CHEST_BLUE_OPENED));
    SuperListItem::setModelItemName(m_modelObjects3D, 5, RPM::translate(Translations::SMALL_CHEST_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 6, RPM::translate(Translations::SMALL_CHEST_GREEN_OPENED));
    SuperListItem::setModelItemName(m_modelObjects3D, 7, RPM::translate(Translations::SMALL_CHEST_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 8, RPM::translate(Translations::SMALL_CHEST_RED_OPENED));
    SuperListItem::setModelItemName(m_modelObjects3D, 9, RPM::translate(Translations::CHEST_BOX));
    SuperListItem::setModelItemName(m_modelObjects3D, 10, RPM::translate(Translations::CHEST_OPENED_1));
    SuperListItem::setModelItemName(m_modelObjects3D, 11, RPM::translate(Translations::CHEST_OPENED_2));
    SuperListItem::setModelItemName(m_modelObjects3D, 12, RPM::translate(Translations::SMALL_LOG));
    SuperListItem::setModelItemName(m_modelObjects3D, 13, RPM::translate(Translations::LOG));
    SuperListItem::setModelItemName(m_modelObjects3D, 14, RPM::translate(Translations::BIG_LOG));
    SuperListItem::setModelItemName(m_modelObjects3D, 15, RPM::translate(Translations::PICNIC_TABLE_STONE));
    SuperListItem::setModelItemName(m_modelObjects3D, 16, RPM::translate(Translations::PICNIC_TABLE_WOOD));
    SuperListItem::setModelItemName(m_modelObjects3D, 17, RPM::translate(Translations::WOODFENCE_1));
    SuperListItem::setModelItemName(m_modelObjects3D, 18, RPM::translate(Translations::WOODFENCE_2));
    SuperListItem::setModelItemName(m_modelObjects3D, 19, RPM::translate(Translations::WOODFENCE_3));
    SuperListItem::setModelItemName(m_modelObjects3D, 20, RPM::translate(Translations::WOODFENCE_SNOW_1));
    SuperListItem::setModelItemName(m_modelObjects3D, 21, RPM::translate(Translations::WOODFENCE_SNOW_2));
    SuperListItem::setModelItemName(m_modelObjects3D, 22, RPM::translate(Translations::WOODFENCE_SNOW_3));
    SuperListItem::setModelItemName(m_modelObjects3D, 23, RPM::translate(Translations::BRICK_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 24, RPM::translate(Translations::BIG_BRICK_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 25, RPM::translate(Translations::STONE_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 26, RPM::translate(Translations::BIG_STONE_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 27, RPM::translate(Translations::WOOD_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 28, RPM::translate(Translations::BIG_WOOD_BUILDING));
    SuperListItem::setModelItemName(m_modelObjects3D, 29, RPM::translate(Translations::BRICK_CHIMNEY));
    SuperListItem::setModelItemName(m_modelObjects3D, 30, RPM::translate(Translations::STONE_CHIMNEY));
    SuperListItem::setModelItemName(m_modelObjects3D, 31, RPM::translate(Translations::BRICK_BLUE_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 32, RPM::translate(Translations::BRICK_BLUE_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 33, RPM::translate(Translations::BRICK_GREEN_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 34, RPM::translate(Translations::BRICK_GREEN_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 35, RPM::translate(Translations::BRICK_RED_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 36, RPM::translate(Translations::BRICK_RED_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 37, RPM::translate(Translations::STONE_BLUE_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 38, RPM::translate(Translations::STONE_BLUE_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 39, RPM::translate(Translations::STONE_GREEN_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 40, RPM::translate(Translations::STONE_GREEN_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 41, RPM::translate(Translations::STONE_RED_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 42, RPM::translate(Translations::STONE_RED_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 43, RPM::translate(Translations::WOOD_BLUE_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 44, RPM::translate(Translations::WOOD_BLUE_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 45, RPM::translate(Translations::WOOD_GREEN_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 46, RPM::translate(Translations::WOOD_GREEN_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 47, RPM::translate(Translations::WOOD_RED_HOUSE));
    SuperListItem::setModelItemName(m_modelObjects3D, 48, RPM::translate(Translations::WOOD_RED_HOUSE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 49, RPM::translate(Translations::SMALL_SHOP_STAND_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 50, RPM::translate(Translations::SMALL_SHOP_STAND_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 51, RPM::translate(Translations::SMALL_SHOP_STAND_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 52, RPM::translate(Translations::SMALL_SHOP_STAND_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 53, RPM::translate(Translations::SMALL_SHOP_STAND_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 54, RPM::translate(Translations::SHOP_STAND_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 55, RPM::translate(Translations::SHOP_STAND_BLACK_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 56, RPM::translate(Translations::SHOP_STAND_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 57, RPM::translate(Translations::SHOP_STAND_BLUE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 58, RPM::translate(Translations::SHOP_STAND_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 59, RPM::translate(Translations::SHOP_STAND_GREEN_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 60, RPM::translate(Translations::SHOP_STAND_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 61, RPM::translate(Translations::SHOP_STAND_RED_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 62, RPM::translate(Translations::SHOP_STAND_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 63, RPM::translate(Translations::SHOP_STAND_WHITE_SNOW));
    SuperListItem::setModelItemName(m_modelObjects3D, 64, RPM::translate(Translations::BENCH_STONE));
    SuperListItem::setModelItemName(m_modelObjects3D, 65, RPM::translate(Translations::BENCH_WOOD));
    SuperListItem::setModelItemName(m_modelObjects3D, 66, RPM::translate(Translations::BUS));
    SuperListItem::setModelItemName(m_modelObjects3D, 67, RPM::translate(Translations::CAR_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 68, RPM::translate(Translations::CAR_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 69, RPM::translate(Translations::CAR_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 70, RPM::translate(Translations::CAR_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 71, RPM::translate(Translations::CAR_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 72, RPM::translate(Translations::BED_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 73, RPM::translate(Translations::BED_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 74, RPM::translate(Translations::BED_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 75, RPM::translate(Translations::BED_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 76, RPM::translate(Translations::BED_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 77, RPM::translate(Translations::BIG_BED_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 78, RPM::translate(Translations::BIG_BED_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 79, RPM::translate(Translations::BIG_BED_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 80, RPM::translate(Translations::BIG_BED_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 81, RPM::translate(Translations::BIG_BED_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 82, RPM::translate(Translations::DRESSER));
    SuperListItem::setModelItemName(m_modelObjects3D, 83, RPM::translate(Translations::SOFA_BLACK));
    SuperListItem::setModelItemName(m_modelObjects3D, 84, RPM::translate(Translations::SOFA_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 85, RPM::translate(Translations::SOFA_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 86, RPM::translate(Translations::SOFA_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 87, RPM::translate(Translations::SOFA_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 88, RPM::translate(Translations::SMALL_TV));
    SuperListItem::setModelItemName(m_modelObjects3D, 89, RPM::translate(Translations::TV));
    SuperListItem::setModelItemName(m_modelObjects3D, 90, RPM::translate(Translations::SMALL_TABLE));
    SuperListItem::setModelItemName(m_modelObjects3D, 91, RPM::translate(Translations::TABLE));
    SuperListItem::setModelItemName(m_modelObjects3D, 92, RPM::translate(Translations::BIG_TABLE));
    SuperListItem::setModelItemName(m_modelObjects3D, 93, RPM::translate(Translations::CHAIR_BLUE));
    SuperListItem::setModelItemName(m_modelObjects3D, 94, RPM::translate(Translations::CHAIR_GREEN));
    SuperListItem::setModelItemName(m_modelObjects3D, 95, RPM::translate(Translations::CHAIR_RED));
    SuperListItem::setModelItemName(m_modelObjects3D, 96, RPM::translate(Translations::CHAIR_WHITE));
    SuperListItem::setModelItemName(m_modelObjects3D, 97, RPM::translate(Translations::SMALL_BOOKSHELF));
    SuperListItem::setModelItemName(m_modelObjects3D, 98, RPM::translate(Translations::BOOKSHELF));
    SuperListItem::setModelItemName(m_modelObjects3D, 99, RPM::translate(Translations::FRIDGE));
    SuperListItem::setModelItemName(m_modelObjects3D, 100, RPM::translate(Translations::CABINET_1));
    SuperListItem::setModelItemName(m_modelObjects3D, 101, RPM::translate(Translations::CABINET_2));
    SuperListItem::setModelItemName(m_modelObjects3D, 102, RPM::translate(Translations::CABINET_3));
    SuperListItem::setModelItemName(m_modelObjects3D, 103, RPM::translate(Translations::SINK));
    SuperListItem::setModelItemName(m_modelObjects3D, 104, RPM::translate(Translations::BATH));
    SuperListItem::setModelItemName(m_modelObjects3D, 105, RPM::translate(Translations::TOILET));
    SuperListItem::setModelItemName(m_modelObjects3D, 106, RPM::translate(Translations::CRATE));
    SuperListItem::setModelItemName(m_modelObjects3D, 107, RPM::translate(Translations::BARREL));
    SuperListItem::setModelItemName(m_modelObjects3D, 108, RPM::translate(Translations::BARREL_CLOSED));
    SuperListItem::setModelItemName(m_modelObjects3D, 109, RPM::translate(Translations::BARREL_FRUITS));
    SuperListItem::setModelItemName(m_modelObjects3D, 110, RPM::translate(Translations::BARREL_VEGETABLES));
    SuperListItem::setModelItemName(m_modelObjects3D, 111, RPM::translate(Translations::CUBE_COBBLESTONE));
    SuperListItem::setModelItemName(m_modelObjects3D, 112, RPM::translate(Translations::MINECART));
    SuperListItem::setModelItemName(m_modelMountains, 0, RPM::translate(Translations::GRASS));
    SuperListItem::setModelItemName(m_modelMountains, 1, RPM::translate(Translations::HAUNTED));
    SuperListItem::setModelItemName(m_modelMountains, 2, RPM::translate(Translations::SNOW));
    SuperListItem::setModelItemName(m_modelMountains, 3, RPM::translate(Translations::DESERT));
    SuperListItem::setModelItemName(m_modelMountains, 4, RPM::translate(Translations::CAVE));
    SuperListItem::setModelItemName(m_modelMountains, 5, RPM::translate(Translations::SIDEWALK));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SpecialElementsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_modelAutotiles, false);
    SuperListItem::deleteModel(m_modelSpriteWalls, false);
    SuperListItem::deleteModel(m_modelObjects3D, false);
    SuperListItem::deleteModel(m_modelMountains, false);

    // Read
    readSpecials(json, PictureKind::Walls, JSON_WALLS);
    readSpecials(json, PictureKind::Autotiles, JSON_AUTOTILES);
    readSpecials(json, PictureKind::Object3D, JSON_OBJECTS_3D);
    readSpecials(json, PictureKind::Mountains, JSON_MOUNTAINS);
}

// -------------------------------------------------------

void SpecialElementsDatas::readSpecials(const QJsonObject &json,
                                        PictureKind kind, QString jsonName)
{
    QJsonArray jsonList = json[jsonName].toArray();
    QStandardItem* item;
    SuperListItem* sys;
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        sys = SuperListItem::getnewInstance(kind);
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        this->model(kind)->appendRow(item);
    }

    // Missing object 3D
    if (m_missingObject3D != nullptr) {
        delete m_missingObject3D;
    }
    m_missingObject3D = new SystemObject3D;
}

// -------------------------------------------------------

void SpecialElementsDatas::write(QJsonObject &json) const{
    writeSpecials(json, PictureKind::Walls, JSON_WALLS);
    writeSpecials(json, PictureKind::Autotiles, JSON_AUTOTILES);
    writeSpecials(json, PictureKind::Object3D, JSON_OBJECTS_3D);
    writeSpecials(json, PictureKind::Mountains, JSON_MOUNTAINS);
}

// -------------------------------------------------------

void SpecialElementsDatas::writeSpecials(QJsonObject &json, PictureKind kind,
                                         QString jsonName) const
{
    QJsonArray jsonArray;

    for (int i = 0; i < this->model(kind)->invisibleRootItem()->rowCount(); i++)
    {
        QJsonObject json;
        SuperListItem* sys = reinterpret_cast<SuperListItem *>(this->model(kind)
            ->item(i)->data().value<quintptr>());
        sys->write(json);
        jsonArray.append(json);
    }
    json[jsonName] = jsonArray;
}
