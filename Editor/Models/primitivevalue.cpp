/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "primitivevalue.h"
#include "systemcustomstructureelement.h"
#include "rpm.h"

const QString PrimitiveValue::JSON_IS_ACTIVATED = "ia";
const QString PrimitiveValue::JSON_CUSTOM_STRUCTURE = "customStructure";
const QString PrimitiveValue::JSON_CUSTOM_LIST = "customList";
const QString PrimitiveValue::JSON_X = "x";
const QString PrimitiveValue::JSON_Y = "y";
const QString PrimitiveValue::JSON_Z = "z";
const QString PrimitiveValue::JSON_MIN = "min";
const QString PrimitiveValue::JSON_MAX = "max";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PrimitiveValue::PrimitiveValue() :
    m_kind(PrimitiveValueKind::Anything),
    m_numberValue(1),
    m_numberDoubleValue(0),
    m_messageValue(""),
    m_switchValue(true),
    m_customStructure(new SystemCustomStructure(0, "")),
    m_customList(new SystemCustomStructure(0, "", true)),
    m_x(nullptr),
    m_y(nullptr),
    m_z(nullptr),
    m_min(-QWIDGETSIZE_MAX),
    m_max(QWIDGETSIZE_MAX),
    m_isActivated(false),
    m_modelParameter(nullptr),
    m_modelProperties(nullptr),
    m_modelDataBase(nullptr)
{

}

PrimitiveValue::PrimitiveValue(int n) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Number;
    m_numberValue = n;
}

PrimitiveValue::PrimitiveValue(double n) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::NumberDouble;
    m_numberDoubleValue = n;
}

PrimitiveValue::PrimitiveValue(QString m) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Message;
    m_messageValue = m;
}

PrimitiveValue::PrimitiveValue(bool s) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Switch;
    m_switchValue = s;
}

PrimitiveValue::PrimitiveValue(PrimitiveValueKind kind) :
    PrimitiveValue()
{
    m_kind = kind;
}

PrimitiveValue::PrimitiveValue(PrimitiveValueKind kind, int n) :
    PrimitiveValue(kind)
{
    m_numberValue = n;
}

PrimitiveValue::PrimitiveValue(PrimitiveValueKind kind, QString m) :
    PrimitiveValue(kind)
{
    m_messageValue = m;
}

PrimitiveValue::~PrimitiveValue()
{
    delete m_customStructure;
    delete m_customList;
    if (m_x != nullptr)
    {
        delete m_x;
    }
    if (m_y != nullptr)
    {
        delete m_y;
    }
    if (m_z != nullptr)
    {
        delete m_z;
    }
}

PrimitiveValueKind PrimitiveValue::kind() const {
    return m_kind;
}

void PrimitiveValue::setKind(PrimitiveValueKind k) {
    m_kind = k;
}

int PrimitiveValue::numberValue() const {
    return m_numberValue;
}

void PrimitiveValue::setNumberValue(int n) {
    m_numberValue = n;
}

double PrimitiveValue::numberDoubleValue() const {
    return m_numberDoubleValue;
}

void PrimitiveValue::setNumberDoubleValue(double n) {
    m_numberDoubleValue = n;
}

QString PrimitiveValue::messageValue() const {
    return m_messageValue;
}

void PrimitiveValue::setMessageValue(QString m) {
    m_messageValue = m;
}

bool PrimitiveValue::switchValue() const {
    return m_switchValue;
}

void PrimitiveValue::setSwitchValue(bool s) {
    m_switchValue = s;
}

SystemCustomStructure * PrimitiveValue::customStructure()
{
    return m_customStructure;
}

SystemCustomStructure * PrimitiveValue::customList()
{
    return m_customList;
}

PrimitiveValue * PrimitiveValue::x() const
{
    return m_x;
}

void PrimitiveValue::setX(PrimitiveValue *x)
{
    m_x = x;
}

PrimitiveValue * PrimitiveValue::y() const
{
    return m_y;
}

void PrimitiveValue::setY(PrimitiveValue *y)
{
    m_y = y;
}

PrimitiveValue * PrimitiveValue::z() const
{
    return m_z;
}

void PrimitiveValue::setZ(PrimitiveValue *z)
{
    m_z = z;
}

int PrimitiveValue::min() const
{
    return m_min;
}

void PrimitiveValue::setMin(int min)
{
    m_min = min;
}

int PrimitiveValue::max() const
{
    return m_max;
}

void PrimitiveValue::setMax(int max)
{
    m_max = max;
}

bool PrimitiveValue::isActivated() const
{
    return m_isActivated;
}

void PrimitiveValue::setIsActivated(bool ia)
{
    m_isActivated = ia;
}

QStandardItemModel * PrimitiveValue::modelParameter() const {
    return m_modelParameter;
}

void PrimitiveValue::setModelParameter(QStandardItemModel *model) {
    m_modelParameter = model;
}

QStandardItemModel * PrimitiveValue::modelProperties() const {
    return m_modelProperties;
}

void PrimitiveValue::setModelProperties(QStandardItemModel *model) {
    m_modelProperties = model;
}

QStandardItemModel * PrimitiveValue::modelDataBase() const {
    return m_modelDataBase;
}

void PrimitiveValue::setModelDataBase(QStandardItemModel *model) {
    m_modelDataBase = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createKeyBoard(int id) {
    PrimitiveValue *v;

    v = new PrimitiveValue;
    v->setKind(PrimitiveValueKind::KeyBoard);
    v->setNumberValue(id);

    return v;
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultDataBaseValue() {
    return new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultNumberValue() {
    return new PrimitiveValue(0);
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultNumberDoubleValue()
{
    return new PrimitiveValue(0.0);
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultMessageValue() {
    return new PrimitiveValue(QString());
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultSwitchValue()
{
    return new PrimitiveValue(true);
}

// -------------------------------------------------------

QString PrimitiveValue::toString() const {
    switch (m_kind) {
    case PrimitiveValueKind::Default:
        return RPM::translate(Translations::DEFAULT);
    case PrimitiveValueKind::Anything:
        return RPM::translate(Translations::ANYTHING);
    case PrimitiveValueKind::None:
        return RPM::translate(Translations::NONE);
    case PrimitiveValueKind::Number:
        return QString::number(m_numberValue);
    case PrimitiveValueKind::NumberDouble:
        return QString::number(m_numberDoubleValue);
    case PrimitiveValueKind::Variable:
    {
        SuperListItem *super = RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(m_numberValue);
        return super == nullptr ? "" : RPM::translate(Translations::VARIABLE) +
            RPM::COLON + RPM::SPACE + super->toString();
    }
    case PrimitiveValueKind::Parameter:
        return this->modelParameter() == nullptr ? "" : RPM::translate(
            Translations::PARAMETER) + RPM::COLON + RPM::SPACE + SuperListItem
            ::getById(this->modelParameter()->invisibleRootItem(), m_numberValue
            )->toString();
    case PrimitiveValueKind::Property:
        return this->modelProperties() == nullptr ? "" : RPM::translate(
            Translations::PROPERTY) + RPM::COLON + RPM::SPACE + SuperListItem
            ::getById(this->modelProperties()->invisibleRootItem(),
            m_numberValue)->toString();
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
    {
        if (this->modelDataBase() == nullptr)
        {
            return nullptr;
        }
        SuperListItem *super = SuperListItem::getById(this->modelDataBase()
            ->invisibleRootItem(), m_numberValue);
        return super == nullptr ? "" : super->toString();
    }
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Font:
        return '"' + m_messageValue + '"';
    case PrimitiveValueKind::Script:
        return RPM::translate(Translations::SCRIPT) + RPM::SPACE + ">" + RPM
            ::SPACE + m_messageValue;
    case PrimitiveValueKind::Switch:
        return (m_switchValue ? "ON" : "OFF");
    case PrimitiveValueKind::KeyBoard:
        return RPM::translate(Translations::KEYBOARD_SHORT) + RPM::COLON + RPM
            ::SPACE + reinterpret_cast<SystemKeyBoard *>(SuperListItem::getById(
            RPM::get()->project()->keyBoardDatas()->model()
            ->invisibleRootItem(), m_numberValue))->toString();
    case PrimitiveValueKind::CustomStructure:
        return m_customStructure->toString();
    case PrimitiveValueKind::CustomList:
        return m_customList->toString();
    case PrimitiveValueKind::Vector2:
        return "x: " + m_x->toString() + ", y: " + m_y->toString();
    case PrimitiveValueKind::Vector3:
        return "x: " + m_x->toString() + ", y: " + m_y->toString() + ", z: " +
            m_z->toString();
    }
    return "";
}

// -------------------------------------------------------

bool PrimitiveValue::isFixNumberValue() const {
    return m_kind == PrimitiveValueKind::DataBase || m_kind == PrimitiveValueKind
        ::Number || m_kind == PrimitiveValueKind::NumberDouble;
}

// -------------------------------------------------------

bool PrimitiveValue::isMinActivated() const
{
    return m_min != -QWIDGETSIZE_MAX;
}

// -------------------------------------------------------

bool PrimitiveValue::isMaxActivated() const
{
    return m_max != QWIDGETSIZE_MAX;
}

// -------------------------------------------------------

void PrimitiveValue::labelTab(QString &str) const {
    switch (m_kind) {
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::Default:
        break;
    case PrimitiveValueKind::None:
        str += RPM::translate(Translations::NONE).toUpper();
        break;
    case PrimitiveValueKind::Number:
        str += QString::number(m_numberValue);
        break;
    case PrimitiveValueKind::NumberDouble:
        str += QString::number(m_numberDoubleValue);
        break;
    case PrimitiveValueKind::Variable:
    {
        SuperListItem *super = RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(m_numberValue);
        str += super == nullptr ? "" : RPM::translate(Translations::VARIABLE_SHORT)
            + ">" + super->name();
        break;
    }
    case PrimitiveValueKind::Message:
        str += "\"" + m_messageValue + "\"";
        break;
    case PrimitiveValueKind::Script:
        str += "<" + m_messageValue + ">";
        break;
    case PrimitiveValueKind::Switch:
        str += (m_switchValue ? "ON" : "OFF");
        break;
    case PrimitiveValueKind::KeyBoard:
        str += RPM::translate(Translations::KEYBOARD_SHORT) + ">" +
            reinterpret_cast<SystemKeyBoard *>(SuperListItem::getById(RPM::get()
            ->project()->keyBoardDatas()->model()->invisibleRootItem(),
            m_numberValue))->abbreviation();
        break;
    case PrimitiveValueKind::Property:
        str += RPM::translate(Translations::PROPERTY_SHORT) + ">" +
            SuperListItem::getById(RPM::get()->project()->currentObject()
            ->modelProperties()->invisibleRootItem(), m_numberValue)->name();
        break;
    case PrimitiveValueKind::Font:
        str += m_messageValue;
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultDataBaseValue() const {
    return m_kind == PrimitiveValueKind::DataBase && m_numberValue == 1;
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultNumberValue(int value) const {
    return m_kind == PrimitiveValueKind::Number && m_numberValue == value;
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultNumberDoubleValue() const {
    return m_kind == PrimitiveValueKind::NumberDouble && m_numberDoubleValue ==
        0.0;
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultMessageValue() const {
    return m_kind == PrimitiveValueKind::Message && m_messageValue.isEmpty();
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultSwitchValue() const
{
    return m_kind == PrimitiveValueKind::Switch && m_switchValue;
}

// -------------------------------------------------------

void PrimitiveValue::initializeCommandParameter(const EventCommand *command, int
    &i, bool active)
{
    m_kind = static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
        .toInt());
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
        m_numberValue = command->valueCommandAt(i++).toInt();
        break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        m_messageValue = command->valueCommandAt(i++);
        break;
    case PrimitiveValueKind::Switch:
        m_switchValue = command->valueCommandAt(i++) == RPM::TRUE_BOOL_STRING;
        break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = command->valueCommandAt(i++).toDouble();
        break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->initializeCommandParameter(command, i);
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->initializeCommandParameter(command, i);
        break;
    case PrimitiveValueKind::Vector2:
        m_x->initializeCommandParameter(command, i);
        m_y->initializeCommandParameter(command, i);
        break;
    case PrimitiveValueKind::Vector3:
        m_x->initializeCommandParameter(command, i);
        m_y->initializeCommandParameter(command, i);
        m_z->initializeCommandParameter(command, i);
        break;
    }
    if (active)
    {
        m_isActivated = RPM::stringToBool(command->valueCommandAt(i++));
    }
}

// -------------------------------------------------------

void PrimitiveValue::initializeCommands(const QVector<QString> &command, int &i,
    bool active)
{
    m_kind = static_cast<PrimitiveValueKind>(command.at(i++).toInt());
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
        m_numberValue = command.at(i++).toInt();
        break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        m_messageValue = command.at(i++);
        break;
    case PrimitiveValueKind::Switch:
        m_switchValue = command.at(i++) == RPM::TRUE_BOOL_STRING;
        break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = command.at(i++).toDouble();
        break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->initializeCommands(command, i);
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->initializeCommands(command, i);
        break;
    case PrimitiveValueKind::Vector2:
        m_x->initializeCommands(command, i);
        m_y->initializeCommands(command, i);
        break;
    case PrimitiveValueKind::Vector3:
        m_x->initializeCommands(command, i);
        m_y->initializeCommands(command, i);
        m_z->initializeCommands(command, i);
        break;
    }
    if (active)
    {
        m_isActivated = RPM::stringToBool(command.at(i++));
    }
}

// -------------------------------------------------------

void PrimitiveValue::getCommandParameter(QVector<QString> &command, bool active)
{
    command.append(QString::number(static_cast<int>(m_kind)));
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
        command.append(QString::number(m_numberValue));
        break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        command.append(m_messageValue);
        break;
    case PrimitiveValueKind::Switch:
        command.append(m_switchValue ? RPM::TRUE_BOOL_STRING : RPM
            ::FALSE_BOOL_STRING);
        break;
    case PrimitiveValueKind::NumberDouble:
        command.append(QString::number(m_numberDoubleValue));
        break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->getCommandParameter(command);
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->getCommandParameter(command);
        break;
    case PrimitiveValueKind::Vector2:
        m_x->getCommandParameter(command);
        m_y->getCommandParameter(command);
        break;
    case PrimitiveValueKind::Vector3:
        m_x->getCommandParameter(command);
        m_y->getCommandParameter(command);
        m_z->getCommandParameter(command);
        break;
    }
    if (active)
    {
        command.append(RPM::boolToString(m_isActivated));
    }
}

// -------------------------------------------------------

void PrimitiveValue::updateModelsParametersProperties(QStandardItemModel
    *parameters, QStandardItemModel *properties)
{
    m_modelParameter = parameters;
    m_modelProperties = properties;
    QStandardItemModel *model = nullptr;
    switch (m_kind)
    {
    case PrimitiveValueKind::CustomStructure:
        model = m_customStructure->model();
        break;
    case PrimitiveValueKind::CustomList:
        model = m_customList->model();
        break;
    default:
        return;
    }
    SystemCustomStructureElement *element;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        element = reinterpret_cast<SystemCustomStructureElement *>(SuperListItem
            ::getItemModelAt(model, i));
        if (element != nullptr)
        {
            element->value()->updateModelsParametersProperties(parameters,
                properties);
        }
    }
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createCopy() const{
    PrimitiveValue *prim = new PrimitiveValue;
    prim->setCopy(*this);
    return prim;
}

// -------------------------------------------------------

void PrimitiveValue::setCopy(const PrimitiveValue &prim) {
    m_kind = prim.kind();

    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
         m_numberValue = prim.m_numberValue; break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        m_messageValue = prim.m_messageValue; break;
    case PrimitiveValueKind::Switch:
        m_switchValue = prim.m_switchValue; break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = prim.m_numberDoubleValue; break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->setCopy(*prim.m_customStructure);
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->setCopy(*prim.m_customList);
        break;
    case PrimitiveValueKind::Vector2:
        if (m_x == nullptr)
        {
            m_x = new PrimitiveValue(0);
        }
        if (m_y == nullptr)
        {
            m_y = new PrimitiveValue(0);
        }
        m_x->setCopy(*prim.m_x);
        m_y->setCopy(*prim.m_y);
        break;
    case PrimitiveValueKind::Vector3:
        if (m_x == nullptr)
        {
            m_x = new PrimitiveValue(0);
        }
        if (m_y == nullptr)
        {
            m_y = new PrimitiveValue(0);
        }
        if (m_z == nullptr)
        {
            m_z = new PrimitiveValue(0);
        }
        m_x->setCopy(*prim.m_x);
        m_y->setCopy(*prim.m_y);
        m_z->setCopy(*prim.m_z);
        break;
    }
    m_min = prim.m_min;
    m_max = prim.m_max;
    m_isActivated = prim.m_isActivated;
    m_modelParameter = prim.m_modelParameter;
    m_modelProperties = prim.m_modelProperties;
    m_modelDataBase = prim.m_modelDataBase;
}

// -------------------------------------------------------

void PrimitiveValue::read(const QJsonObject &json) {
    QJsonValue v;

    m_kind = static_cast<PrimitiveValueKind>(json[RPM::JSON_KEY].toInt());

    // Value
    v = json[RPM::JSON_VALUE];
    switch (m_kind)
    {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
        m_numberValue = v.toInt(); break;    
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        m_messageValue = v.toString(); break;
    case PrimitiveValueKind::Switch:
        m_switchValue = v.toBool(); break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = v.toDouble(); break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->read(json[JSON_CUSTOM_STRUCTURE].toObject());
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->read(json[JSON_CUSTOM_LIST].toObject());
        break;
    case PrimitiveValueKind::Vector2:
        if (m_x == nullptr)
        {
            m_x = new PrimitiveValue(0);
        }
        if (m_y == nullptr)
        {
            m_y = new PrimitiveValue(0);
        }
        m_x->read(json[JSON_X].toObject());
        m_y->read(json[JSON_X].toObject());
        break;
    case PrimitiveValueKind::Vector3:
        if (m_x == nullptr)
        {
            m_x = new PrimitiveValue(0);
        }
        if (m_y == nullptr)
        {
            m_y = new PrimitiveValue(0);
        }
        if (m_z == nullptr)
        {
            m_z = new PrimitiveValue(0);
        }
        m_x->read(json[JSON_X].toObject());
        m_y->read(json[JSON_X].toObject());
        m_z->read(json[JSON_X].toObject());
        break;
    }
    if (json.contains(JSON_IS_ACTIVATED))
    {
        m_isActivated = json[JSON_IS_ACTIVATED].toBool();
    }
    if (json.contains(JSON_MIN))
    {
        m_min = json[JSON_MIN].toInt();
    }
    if (json.contains(JSON_MAX))
    {
        m_max = json[JSON_MAX].toInt();
    }
}

// -------------------------------------------------------

void PrimitiveValue::write(QJsonObject &json) const{
    QJsonValue v;
    QJsonObject obj;

    json[RPM::JSON_KEY] = static_cast<int>(m_kind);

    // Value
    switch (m_kind)
    {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
    case PrimitiveValueKind::Class:
    case PrimitiveValueKind::Hero:
    case PrimitiveValueKind::Monster:
    case PrimitiveValueKind::Troop:
    case PrimitiveValueKind::Item:
    case PrimitiveValueKind::Weapon:
    case PrimitiveValueKind::Armor:
    case PrimitiveValueKind::Skill:
    case PrimitiveValueKind::Animation:
    case PrimitiveValueKind::Status:
    case PrimitiveValueKind::Tileset:
    case PrimitiveValueKind::FontSize:
    case PrimitiveValueKind::FontName:
    case PrimitiveValueKind::Color:
    case PrimitiveValueKind::WindowSkin:
    case PrimitiveValueKind::Currency:
    case PrimitiveValueKind::Speed:
    case PrimitiveValueKind::Detection:
    case PrimitiveValueKind::CameraProperty:
    case PrimitiveValueKind::Frequency:
    case PrimitiveValueKind::Skybox:
    case PrimitiveValueKind::BattleMap:
    case PrimitiveValueKind::Element:
    case PrimitiveValueKind::CommonStatistic:
    case PrimitiveValueKind::WeaponsKind:
    case PrimitiveValueKind::ArmorsKind:
    case PrimitiveValueKind::CommonBattleCommand:
    case PrimitiveValueKind::CommonEquipment:
    case PrimitiveValueKind::Event:
    case PrimitiveValueKind::State:
    case PrimitiveValueKind::CommonReaction:
    case PrimitiveValueKind::Model:
    case PrimitiveValueKind::Bars:
    case PrimitiveValueKind::Icons:
    case PrimitiveValueKind::Autotiles:
    case PrimitiveValueKind::Characters:
    case PrimitiveValueKind::Mountains:
    case PrimitiveValueKind::Tilesets:
    case PrimitiveValueKind::Walls:
    case PrimitiveValueKind::Battlers:
    case PrimitiveValueKind::Facesets:
    case PrimitiveValueKind::WindowSkins:
    case PrimitiveValueKind::TitleScreen:
    case PrimitiveValueKind::Object3D:
    case PrimitiveValueKind::Pictures:
    case PrimitiveValueKind::Animations:
    case PrimitiveValueKind::SkyBoxes:
    case PrimitiveValueKind::Enum:
    case PrimitiveValueKind::Music:
    case PrimitiveValueKind::BackgroundSound:
    case PrimitiveValueKind::Sound:
    case PrimitiveValueKind::MusicEffect:
        v = m_numberValue; break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
    case PrimitiveValueKind::Font:
        v = m_messageValue; break;
    case PrimitiveValueKind::Switch:
        v = m_switchValue; break;
    case PrimitiveValueKind::NumberDouble:
        v = m_numberDoubleValue; break;
    case PrimitiveValueKind::CustomStructure:
        m_customStructure->write(obj);
        json[JSON_CUSTOM_STRUCTURE] = obj;
        break;
    case PrimitiveValueKind::CustomList:
        m_customList->write(obj);
        json[JSON_CUSTOM_LIST] = obj;
        break;
    case PrimitiveValueKind::Vector2:
        m_x->write(obj);
        json[JSON_X] = obj;
        m_y->write(obj);
        json[JSON_Y] = obj;
        break;
    case PrimitiveValueKind::Vector3:
        m_x->write(obj);
        json[JSON_X] = obj;
        m_y->write(obj);
        json[JSON_Y] = obj;
        m_z->write(obj);
        json[JSON_Z] = obj;
        break;
    }
    json[RPM::JSON_VALUE] = v;
    if (m_isActivated)
    {
        json[JSON_IS_ACTIVATED] = m_isActivated;
    }
    if (m_min != -QWIDGETSIZE_MAX)
    {
        json[JSON_MIN] = m_min;
    }
    if (m_max != QWIDGETSIZE_MAX)
    {
        json[JSON_MAX] = m_max;
    }
}
