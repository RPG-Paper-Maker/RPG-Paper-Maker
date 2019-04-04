/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDMODIFYINVENTORY_H
#define DIALOGCOMMANDMODIFYINVENTORY_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandModifyInventory
//
//  A dialog used for changing inventory of a character.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandModifyInventory;
}

class DialogCommandModifyInventory : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandModifyInventory(EventCommand *command = nullptr,
                                          QWidget *parent = 0);
    virtual ~DialogCommandModifyInventory();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandModifyInventory *ui;
    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;

private slots:
    void on_radioButtonItem_toggled(bool checked);
    void on_radioButtonWeapon_toggled(bool checked);
    void on_radioButtonArmor_toggled(bool checked);
};

#endif // DIALOGCOMMANDMODIFYINVENTORY_H
