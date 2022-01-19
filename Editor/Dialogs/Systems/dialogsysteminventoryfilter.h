/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMINVENTORYFILTER_H
#define DIALOGSYSTEMINVENTORYFILTER_H

#include <QDialog>
#include "systeminventoryfilter.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemInventoryFilter
//
//  A dialog used for editing the model of a system inventory filter.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemInventoryFilter;
}

class DialogSystemInventoryFilter : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemInventoryFilter(SystemInventoryFilter &inventoryFilter,
        QWidget *parent = nullptr);
    ~DialogSystemInventoryFilter();

    void initialize();
    void translate();
    void setVisibleCustom(bool b);
    void setVisibleScript(bool b);

private:
    Ui::DialogSystemInventoryFilter *ui;
    SystemInventoryFilter &m_inventoryFilter;

public slots:
    void on_comboBoxKind_currentIndexChanged(int index);
    void on_plainTextScript_textChanged();
};

#endif // DIALOGSYSTEMINVENTORYFILTER_H
