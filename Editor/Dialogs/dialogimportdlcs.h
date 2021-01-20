/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGIMPORTDLCS_H
#define DIALOGIMPORTDLCS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogImportDLCs
//
//  A dialog used for importing DLC(s) assets.
//
// -------------------------------------------------------

namespace Ui {
class DialogImportDLCs;
}

class DialogImportDLCs : public QDialog
{
    Q_OBJECT

public:
    explicit DialogImportDLCs(QWidget *parent = nullptr);
    ~DialogImportDLCs();

    void initialize();

private:
    Ui::DialogImportDLCs *ui;

    void translate();
};

#endif // DIALOGIMPORTDLCS_H
