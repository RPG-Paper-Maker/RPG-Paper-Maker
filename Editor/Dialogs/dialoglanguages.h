/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGLANGUAGES_H
#define DIALOGLANGUAGES_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogLanguages
//
//  A dialog used for updating languages.
//
// -------------------------------------------------------


namespace Ui {
class DialogLanguages;
}

class DialogLanguages : public QDialog
{
    Q_OBJECT

public:
    explicit DialogLanguages(QWidget *parent = nullptr);
    ~DialogLanguages();

    void initialize();
    void translate();

private:
    Ui::DialogLanguages *ui;
};

#endif // DIALOGLANGUAGES_H
