/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systeminventoryfilter.h"
#include "dialogsysteminventoryfilter.h"
#include "rpm.h"

const QString SystemInventoryFilter::JSON_KIND = "kind";
const QString SystemInventoryFilter::JSON_ITEM_TYPE_ID = "itemTypeID";
const QString SystemInventoryFilter::JSON_SCRIPT = "script";
const InventoryFilterKind SystemInventoryFilter::DEFAULT_KIND = InventoryFilterKind::All;
const QString SystemInventoryFilter::DEFAULT_SCRIPT = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemInventoryFilter::SystemInventoryFilter():
    SystemInventoryFilter(1, new LangsTranslation(""))
{

}

SystemInventoryFilter::SystemInventoryFilter(int id, LangsTranslation *names,
    InventoryFilterKind kind, PrimitiveValue *itemTypeID, QString script):
    SystemLang(id, names),
    m_kind(kind),
    m_itemTypeID(itemTypeID),
    m_script(script)
{
    m_itemTypeID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelItemsTypes());
}

SystemInventoryFilter::~SystemInventoryFilter()
{
    delete m_itemTypeID;
}

InventoryFilterKind SystemInventoryFilter::kind() const
{
    return m_kind;
}

void SystemInventoryFilter::setKind(InventoryFilterKind kind)
{
    m_kind = kind;
}

PrimitiveValue * SystemInventoryFilter::itemTypeID() const
{
    return m_itemTypeID;
}

QString SystemInventoryFilter::script() const
{
    return m_script;
}

void SystemInventoryFilter::setScript(QString script)
{
    m_script = script;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemInventoryFilter::openDialog()
{
    SystemInventoryFilter inventoryFilter;
    inventoryFilter.setCopy(*this);
    DialogSystemInventoryFilter dialog(inventoryFilter);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(inventoryFilter);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemInventoryFilter::createCopy() const
{
    SystemInventoryFilter* super = new SystemInventoryFilter;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemInventoryFilter::setCopy(const SuperListItem &super)
{
    const SystemInventoryFilter *inventoryFilter;
    SystemLang::setCopy(super);
    inventoryFilter = reinterpret_cast<const SystemInventoryFilter *>(&super);
    m_kind = inventoryFilter->m_kind;
    m_itemTypeID->setCopy(*inventoryFilter->m_itemTypeID);
    m_script = inventoryFilter->m_script;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemInventoryFilter::read(const QJsonObject &json){
    SystemLang::read(json);
    if (json.contains(JSON_KIND))
    {
        m_kind = static_cast<InventoryFilterKind>(json[JSON_KIND].toInt());
    }
    if (json.contains(JSON_ITEM_TYPE_ID))
    {
        m_itemTypeID->read(json[JSON_ITEM_TYPE_ID].toObject());
    }
    if (json.contains(JSON_SCRIPT))
    {
        m_script = json[JSON_SCRIPT].toString();
    }
}

// -------------------------------------------------------

void SystemInventoryFilter::write(QJsonObject &json) const {
    SystemLang::write(json);
    QJsonObject obj;
    if (m_kind != DEFAULT_KIND)
    {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    if (m_kind == InventoryFilterKind::Custom && !m_itemTypeID->isDefaultDataBaseValue())
    {
        obj = QJsonObject();
        m_itemTypeID->write(obj);
        json[JSON_ITEM_TYPE_ID] = obj;
    }
    if (m_kind == InventoryFilterKind::Script && m_script != DEFAULT_SCRIPT)
    {
        json[JSON_SCRIPT] = m_script;
    }
}
