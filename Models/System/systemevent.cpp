/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemevent.h"
#include "systemcreateparameter.h"
#include "widgetsupertree.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemEvent::SystemEvent() :
    SystemEvent(1, "", new QStandardItemModel)
{

}

SystemEvent::SystemEvent(int i, QString n, QStandardItemModel* parameters) :
    SuperListItem(i,n),
    m_modelParameters(parameters)
{
    m_modelParameters->setHorizontalHeaderLabels(QStringList({"Name",
                                                              "Default value"
                                                             }));
}

SystemEvent::~SystemEvent(){
    SuperListItem::deleteModel(m_modelParameters);
}

QStandardItemModel* SystemEvent::modelParameters() const {
    return m_modelParameters;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemEvent::createCopy() const{
    SystemEvent* super = new SystemEvent;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemEvent::setCopy(const SystemEvent& item){
    SuperListItem::setCopy(item);

    // parameters
    SuperListItem::copy(m_modelParameters, item.m_modelParameters);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemEvent::read(const QJsonObject &json){
    SuperListItem::read(json);

    // Parameters
    SuperListItem::readTree(m_modelParameters, new SystemCreateParameter, json,
        "p");
}

// -------------------------------------------------------

void SystemEvent::write(QJsonObject &json) const{
    SuperListItem::write(json);

    // Parameters
    SuperListItem::writeTree(m_modelParameters, json, "p");
}

