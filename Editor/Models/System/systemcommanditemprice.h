/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCOMMANDITEMPRICE_H
#define SYSTEMCOMMANDITEMPRICE_H

#include "superlistitem.h"
#include "eventcommand.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemCommandItemPrice
//
//  A particulary command item price (used in shop menu event command).
//
// -------------------------------------------------------

class SystemCommandItemPrice : public SuperListItem
{
public:
    SystemCommandItemPrice();
    SystemCommandItemPrice(int i, QString n, int selectionItem = 0,
        PrimitiveValue *itemID = new PrimitiveValue(PrimitiveValueKind::DataBase,
        1), PrimitiveValue *weaponID = new PrimitiveValue(PrimitiveValueKind
        ::DataBase, 1), PrimitiveValue *armorID = new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), int selectionPrice = 0,
        QStandardItemModel *specificPrice = new QStandardItemModel, int
        selectionStock = 0, PrimitiveValue *specificStock = new PrimitiveValue(1));
    int selectionItem() const;
    void setSelectionItem(int selectionItem);
    PrimitiveValue * itemID() const;
    PrimitiveValue * weaponID() const;
    PrimitiveValue * armorID() const;
    int selectionPrice() const;
    void setSelectionPrice(int selectionPrice);
    QStandardItemModel * specificPrice() const;
    int selectionStock() const;
    void setSelectionStock(int selectionStock);
    PrimitiveValue * specificStock() const;

    QString toStringItem() const;
    QString toStringPrice() const;
    QString toStringStock() const;
    void initialize(const EventCommand* command, int& i);
    void getCommand(QVector<QString> &command);
    void initializeHeaders();

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

protected:
    int m_selectionItem;
    PrimitiveValue *m_itemID;
    PrimitiveValue *m_weaponID;
    PrimitiveValue *m_armorID;
    int m_selectionPrice;
    QStandardItemModel *m_specificPrice;
    int m_selectionStock;
    PrimitiveValue *m_specificStock;
};

#endif // SYSTEMCOMMANDITEMPRICE_H
