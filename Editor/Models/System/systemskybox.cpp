/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemskybox.h"
#include "dialogsystemskybox.h"

const QString SystemSkyBox::JSON_FRONT_ID = "fid";
const QString SystemSkyBox::JSON_BACK_ID = "bid";
const QString SystemSkyBox::JSON_TOP_ID = "tid";
const QString SystemSkyBox::JSON_BOTTOM_ID = "boid";
const QString SystemSkyBox::JSON_LEFT_ID = "lid";
const QString SystemSkyBox::JSON_RIGHT_ID = "rid";
const int SystemSkyBox::DEFAULT_FRONT_ID = 1;
const int SystemSkyBox::DEFAULT_BACK_ID = 1;
const int SystemSkyBox::DEFAULT_TOP_ID = 1;
const int SystemSkyBox::DEFAULT_BOTTOM_ID = 1;
const int SystemSkyBox::DEFAULT_LEFT_ID = 1;
const int SystemSkyBox::DEFAULT_RIGHT_ID = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSkyBox::SystemSkyBox() :
    SystemSkyBox(-1, "")
{

}

SystemSkyBox::SystemSkyBox(int i, QString n, int fid, int bid, int tid, int boid
    , int lid, int rid) :
    SuperListItem (i, n),
    m_frontID(new SuperListItem(fid)),
    m_backID(new SuperListItem(bid)),
    m_topID(new SuperListItem(tid)),
    m_bottomID(new SuperListItem(boid)),
    m_leftID(new SuperListItem(lid)),
    m_rightID(new SuperListItem(rid))
{

}

SystemSkyBox::~SystemSkyBox()
{
    delete m_frontID;
    delete m_backID;
    delete m_topID;
    delete m_bottomID;
    delete m_leftID;
    delete m_rightID;
}

SuperListItem * SystemSkyBox::frontID() const
{
    return m_frontID;
}

SuperListItem * SystemSkyBox::backID() const
{
    return m_backID;
}

SuperListItem * SystemSkyBox::topID() const
{
    return m_topID;
}

SuperListItem * SystemSkyBox::bottomID() const
{
    return m_bottomID;
}

SuperListItem * SystemSkyBox::leftID() const
{
    return m_leftID;
}

SuperListItem * SystemSkyBox::rightID() const
{
    return m_rightID;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemSkyBox::openDialog()
{
    SystemSkyBox skyBox;

    skyBox.setCopy(*this);
    DialogSystemSkyBox dialog(skyBox);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(skyBox);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemSkyBox::createCopy() const
{
    SystemSkyBox *super = new SystemSkyBox;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSkyBox::setCopy(const SuperListItem &super)
{
    const SystemSkyBox *skyBox;

    skyBox = reinterpret_cast<const SystemSkyBox *>(&super);
    SuperListItem::setCopy(super);
    m_frontID->setId(skyBox->m_frontID->id());
    m_backID->setId(skyBox->m_backID->id());
    m_topID->setId(skyBox->m_topID->id());
    m_bottomID->setId(skyBox->m_bottomID->id());
    m_leftID->setId(skyBox->m_leftID->id());
    m_rightID->setId(skyBox->m_rightID->id());
}

// -------------------------------------------------------

void SystemSkyBox::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_FRONT_ID))
    {
        m_frontID->setId(json[JSON_FRONT_ID].toInt());
    }
    if (json.contains(JSON_BACK_ID))
    {
        m_backID->setId(json[JSON_BACK_ID].toInt());
    }
    if (json.contains(JSON_TOP_ID))
    {
        m_topID->setId(json[JSON_TOP_ID].toInt());
    }
    if (json.contains(JSON_BOTTOM_ID))
    {
        m_bottomID->setId(json[JSON_BOTTOM_ID].toInt());
    }
    if (json.contains(JSON_LEFT_ID))
    {
        m_leftID->setId(json[JSON_LEFT_ID].toInt());
    }
    if (json.contains(JSON_RIGHT_ID))
    {
        m_rightID->setId(json[JSON_RIGHT_ID].toInt());
    }
}

// -------------------------------------------------------

void SystemSkyBox::write(QJsonObject &json) const
{
    QJsonObject obj;

    SuperListItem::write(json);
    if (m_frontID->id() != DEFAULT_FRONT_ID)
    {
        json[JSON_FRONT_ID] = m_frontID->id();
    }
    if (m_backID->id() != DEFAULT_BACK_ID)
    {
        json[JSON_BACK_ID] = m_backID->id();
    }
    if (m_topID->id() != DEFAULT_TOP_ID)
    {
        json[JSON_TOP_ID] = m_topID->id();
    }
    if (m_bottomID->id() != DEFAULT_BOTTOM_ID)
    {
        json[JSON_BOTTOM_ID] = m_bottomID->id();
    }
    if (m_leftID->id() != DEFAULT_LEFT_ID)
    {
        json[JSON_LEFT_ID] = m_leftID->id();
    }
    if (m_rightID->id() != DEFAULT_RIGHT_ID)
    {
        json[JSON_RIGHT_ID] = m_rightID->id();
    }
}
