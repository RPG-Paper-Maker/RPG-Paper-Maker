/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSTARTSHOPMENU_H
#define DIALOGCOMMANDSTARTSHOPMENU_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogStartShopMenu
//
//  A dialog used for start shop menu command.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandStartShopMenu;
}

class DialogCommandStartShopMenu : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandStartShopMenu(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandStartShopMenu();

    void translate();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_modelItemPrice;

    void initializePrimitives();

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandStartShopMenu *ui;
};

#endif // DIALOGCOMMANDSTARTSHOPMENU_H
